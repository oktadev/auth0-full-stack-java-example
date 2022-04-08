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
public interface PhotoRepository extends PhotoRepositoryWithBagRelationships, JpaRepository<Photo, Long> {
    default Optional<Photo> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findOneWithToOneRelationships(id));
    }

    default List<Photo> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships());
    }

    default Page<Photo> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAllWithToOneRelationships(pageable));
    }

    @Query(
        value = "select distinct photo from Photo photo left join fetch photo.album",
        countQuery = "select count(distinct photo) from Photo photo"
    )
    Page<Photo> findAllWithToOneRelationships(Pageable pageable);

    @Query("select distinct photo from Photo photo left join fetch photo.album")
    List<Photo> findAllWithToOneRelationships();

    @Query("select photo from Photo photo left join fetch photo.album where photo.id =:id")
    Optional<Photo> findOneWithToOneRelationships(@Param("id") Long id);
}
