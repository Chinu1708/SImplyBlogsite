package me.protik.simplyblog.blogs;

import me.protik.simplyblog.models.Blogs;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface BlogsRepository extends JpaRepository<Blogs, Long> {
    List<Blogs> findAllByMyUsers_Id(Long id);

    List<Blogs> findAllByMyUsers_UserName(String userName);

    Blogs findBlogsById(Long id);
}