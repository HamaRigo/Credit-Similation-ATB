module dev.atb.shared {
    exports dev.atb.models;
    exports dev.atb.repo;
    // Export the package that you want other modules to use
    exports dev.atb.exceptions;
    // If you require other modules, add requires statements here
    requires java.sql;
    requires com.fasterxml.jackson.annotation;
    requires jakarta.persistence;
    requires lombok;
    requires org.hibernate.orm.core;
    requires spring.data.jpa;
    requires spring.context;
    requires spring.boot;
    requires spring.boot.autoconfigure;
    requires spring.cloud.commons;  // Example of requiring other modules
}
