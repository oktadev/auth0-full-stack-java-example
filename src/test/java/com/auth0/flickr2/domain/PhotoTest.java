package com.auth0.flickr2.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.auth0.flickr2.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class PhotoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Photo.class);
        Photo photo1 = new Photo();
        photo1.setId(1L);
        Photo photo2 = new Photo();
        photo2.setId(photo1.getId());
        assertThat(photo1).isEqualTo(photo2);
        photo2.setId(2L);
        assertThat(photo1).isNotEqualTo(photo2);
        photo1.setId(null);
        assertThat(photo1).isNotEqualTo(photo2);
    }
}
