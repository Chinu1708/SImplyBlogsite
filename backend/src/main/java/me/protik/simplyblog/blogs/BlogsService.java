package me.protik.simplyblog.blogs;

import me.protik.simplyblog.models.Blogs;
import me.protik.simplyblog.models.BlogsLikes;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

@Service
public class BlogsService {
    @Autowired
    BlogsRepository blogsRepository;
    @Autowired
    BlogsLikesRepository blogsLikesRepository;

    // Blog Services
    Blogs getBlogByIdService(Long id) {
        return blogsRepository.findBlogsById(id);
    }

    List<Blogs> getAllBlogs() {
        List<Blogs> allBlogs = new ArrayList<>();
        blogsRepository.findAll().forEach(allBlogs::add);
        return allBlogs;
    }

    List<Blogs> getUserBlogs(String userName) {
        List<Blogs> allUserBlogs = new ArrayList<>();
        blogsRepository.findAllByMyUsers_UserName(userName).forEach(allUserBlogs::add);
        return allUserBlogs;
    }

    void addBlog(Blogs blog) {
    	if (blog.getPublishedDate() == null) {
            blog.setPublishedDate(java.sql.Timestamp.valueOf(LocalDateTime.now()));
        }
        blogsRepository.save(blog);
    }

    // BlogLikes Sevices
    BlogsLikes blogLikeStatus(Long blogId, String userName, String userNameSame){
        return blogsLikesRepository
                .findBlogsLikesByBlog_IdAndLikedBy_UserNameOrUnlikedBy_UserName(blogId, userName, userNameSame);
    }
    void addLikeUnlikeService(BlogsLikes bloglike) {
        blogsLikesRepository.save(bloglike);
    }
    void removeLikeUnlikeService(Long id) {
        blogsLikesRepository.deleteById(id);
    }


    Integer noOfLikes(Long blogId) {
        AtomicReference<Integer> count = new AtomicReference<>(0);
        blogsLikesRepository.findAllByBlog_Id(blogId)
                .forEach((blogsLikes) -> {
                    if (blogsLikes.getLikedBy() != null) {
                        count.updateAndGet(v -> v + 1);
                    }
                });
        return count.get();
    }

    Integer noOfUnLikes(Long blogId) {
        AtomicReference<Integer> count = new AtomicReference<>(0);
        blogsLikesRepository.findAllByBlog_Id(blogId)
                .forEach((blogsLikes) -> {
                    if (blogsLikes.getUnlikedBy() != null) {
                        count.updateAndGet(v -> v + 1);
                    }
                });
        return count.get();
    }

    List<BlogsLikes> allBlogLikes() {
        return blogsLikesRepository.findAll();
    }
    public void deletePost(Long id) {
        blogsRepository.deleteById(id);
    }
    public void updateBlog(Long id, Blogs updatedBlog) {
        Blogs existingBlog = blogsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog not found"));

        existingBlog.setTitle(updatedBlog.getTitle());
        existingBlog.setBody(updatedBlog.getBody());
        existingBlog.setPublishedDate(java.sql.Timestamp.valueOf(LocalDateTime.now()));
        blogsRepository.save(existingBlog);
    }

    public Page<Blogs> getBlogsPage(Pageable pageable) {
        return blogsRepository.findAll(pageable);
    }

}
