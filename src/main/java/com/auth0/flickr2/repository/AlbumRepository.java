package com.auth0.flickr2.repository;

import com.auth0.flickr2.domain.Album;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the Album entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AlbumRepository extends JpaRepository<Album, Long> {
    @Query("select album from Album album where album.user.login = ?#{principal.preferredUsername}")
    List<Album> findByUserIsCurrentUser();
}
