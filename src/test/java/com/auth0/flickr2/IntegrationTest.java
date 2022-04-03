package com.auth0.flickr2;

import com.auth0.flickr2.Flickr2App;
import com.auth0.flickr2.config.TestSecurityConfiguration;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * Base composite annotation for integration tests.
 */
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@SpringBootTest(classes = { Flickr2App.class, TestSecurityConfiguration.class })
public @interface IntegrationTest {
}
