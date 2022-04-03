package com.auth0.flickr2.repository;

import com.auth0.flickr2.domain.Photo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Photo entity.
 */
@Repository
public interface PhotoRepository extends JpaRepository<Photo, Long> {
    @Query(
        value = "select distinct photo from Photo photo left join fetch photo.tags",
        countQuery = "select count(distinct photo) from Photo photo"
    )
    Page<Photo> findAllWithEagerRelationships(Pageable pageable);

    @Query("select distinct photo from Photo photo left join fetch photo.tags")
    List<Photo> findAllWithEagerRelationships();

    @Query("select photo from Photo photo left join fetch photo.tags where photo.id =:id")
    Optional<Photo> findOneWithEagerRelationships(@Param("id") Long id);
}
