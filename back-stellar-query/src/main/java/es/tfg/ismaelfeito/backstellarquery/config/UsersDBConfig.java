package es.tfg.ismaelfeito.backstellarquery.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.orm.jpa.vendor.HibernateJpaVendorAdapter;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;
import java.util.HashMap;
import java.util.Map;

@Configuration
@EnableJpaRepositories(
        basePackages           = "es.tfg.ismaelfeito.backstellarquery.users.repository",
        entityManagerFactoryRef = "usersEntityManager",
        transactionManagerRef   = "usersTransactionManager"
)
public class UsersDBConfig {

    // 1. Lee el bloque spring.datasource.users.* del application.properties
    @Primary
    @Bean
    @ConfigurationProperties("spring.datasource.users")
    public DataSourceProperties usersDataSourceProperties() {
        return new DataSourceProperties();
    }

    // 2. Construye el DataSource (HikariCP) con esas propiedades
    @Primary
    @Bean
    @ConfigurationProperties("spring.datasource.users.hikari")
    public HikariDataSource usersDataSource() {
        return usersDataSourceProperties()
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    // 3. EntityManagerFactory apuntando al DataSource de users
    @Primary
    @Bean
    public LocalContainerEntityManagerFactoryBean usersEntityManager(
            @Qualifier("usersDataSource") DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("es.tfg.ismaelfeito.backstellarquery.users.entity");
        em.setPersistenceUnitName("users");

        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(adapter);

        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.dialect",             "org.hibernate.dialect.PostgreSQLDialect");
        props.put("hibernate.hbm2ddl.auto",        "validate");
        props.put("hibernate.show_sql",             "true");
        props.put("hibernate.format_sql",           "true");
        em.setJpaPropertyMap(props);

        return em;
    }

    // 4. TransactionManager para users
    @Primary
    @Bean
    public PlatformTransactionManager usersTransactionManager(
            @Qualifier("usersEntityManager") LocalContainerEntityManagerFactoryBean emf) {
        EntityManagerFactory factory = emf.getObject();
        return new JpaTransactionManager(factory);
    }
}
