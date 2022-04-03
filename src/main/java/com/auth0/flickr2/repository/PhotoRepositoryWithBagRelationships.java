package com.auth0.flickr2.repository;

import com.auth0.flickr2.domain.Photo;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface PhotoRepositoryWithBagRelationships {
    Optional<Photo> fetchBagRelationships(Optional<Photo> photo);

    List<Photo> fetchBagRelationships(List<Photo> photos);

    Page<Photo> fetchBagRelationships(Page<Photo> photos);
}
