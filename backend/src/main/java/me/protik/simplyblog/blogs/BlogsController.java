package me.protik.simplyblog.blogs;

import me.protik.simplyblog.models.*;
import me.protik.simplyblog.my_users.MyUsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class BlogsController {
    @Autowired
    private BlogsService blogsService;
    @Autowired
    private MyUsersService myUsersService;
    @Autowired
    private BlogsRepository blogsRepository;

    //Blogs APIs
    @GetMapping("/blogs/show/{id}")
    public Blogs showABlogById(@PathVariable Long id){
        return blogsService.getBlogByIdService(id);
    }
    @GetMapping("/blogs")
    public List<Blogs> showAllBlogs(){
        return blogsService.getAllBlogs();
    }
    @GetMapping("/blogs/{userName}")
    public List<Blogs> showAllUserBlogs(@PathVariable String userName){
        return blogsService.getUserBlogs(userName);
    }

    @PostMapping("/blogs/add")
    public void addBlog(@RequestBody Blogs blog){
        blogsService.addBlog(blog);
    }

    //BlogLikes APIs
    @GetMapping("/blogs/{id}/{userName}") //Get Like Status of User For A Particular Blog
    BlogsLikes getBlogUserLikeStatus(@PathVariable Long id, @PathVariable String userName){
        return blogsService.blogLikeStatus(id, userName, userName);
    }
    @PostMapping("/blogs/likeunlike/") // Add/Modify User Like On A Blog
    void addLikeUnlike(@RequestBody BlogsLikes blogsLikes){
        blogsService.addLikeUnlikeService(blogsLikes);
    }
    @PutMapping("/blogs/update/{id}")
    public ResponseEntity<String> updateBlog(@PathVariable Long id, @RequestBody Blogs updatedBlog) {
        try {
            blogsService.updateBlog(id, updatedBlog);
            return ResponseEntity.ok("Blog updated successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Blog not found.");
        }
    }

    @PostMapping("/blogs/likeunlike/remove/{id}") // Remove User Like On A Blog
    void removeLikeUnlike(@PathVariable Long id){
        blogsService.removeLikeUnlikeService(id);
    }
    @GetMapping("/blogs/likes/{id}") // No Of Unlikes Received By A Blog
    Integer noOfLikesBlog(@PathVariable Long id){
        return blogsService.noOfLikes(id);
    }
    @GetMapping("/blogs/unlikes/{id}") // No Of Likes Received By A Blog
    Integer noOfUnlikesBlog(@PathVariable Long id){
        return blogsService.noOfUnLikes(id);
    }
    @GetMapping("/blogs/get") // Get All BlogLikes Objects
    List<BlogsLikes> getAllBlogLikes(){
        return blogsService.allBlogLikes();
    }
    
    @DeleteMapping("/blogs/delete/{id}")
    @PreAuthorize("hasRole('ADMIN') or @blogPostService.isPostOwner(#id, authentication.name)")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        blogsService.deletePost(id);
        return ResponseEntity.ok().build();
        
        
    }
    @GetMapping("/blogs/public")
    public Page<Blogs> getAllBlogs(@RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "5") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("publishedDate").descending());
        return blogsRepository.findAll(pageable);
    }


    }
