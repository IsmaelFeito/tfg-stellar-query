package es.tfg.ismaelfeito.backstellarquery.config;

import com.zaxxer.hikari.HikariDataSource;
import jakarta.persistence.EntityManagerFactory;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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
        basePackages            = "es.tfg.ismaelfeito.backstellarquery.game.repository",
        entityManagerFactoryRef = "gameEntityManager",
        transactionManagerRef   = "gameTransactionManager"
)
public class GameDBConfig {

    // 1. Lee el bloque spring.datasource.game.* del application.properties
    @Bean
    @ConfigurationProperties("spring.datasource.game")
    public DataSourceProperties gameDataSourceProperties() {
        return new DataSourceProperties();
    }

    // 2. Construye el DataSource (HikariCP) con esas propiedades
    @Bean
    @ConfigurationProperties("spring.datasource.game.hikari")
    public HikariDataSource gameDataSource() {
        return gameDataSourceProperties()
                .initializeDataSourceBuilder()
                .type(HikariDataSource.class)
                .build();
    }

    // 3. EntityManagerFactory apuntando al DataSource de game
    @Bean
    public LocalContainerEntityManagerFactoryBean gameEntityManager(
            @Qualifier("gameDataSource") DataSource dataSource) {

        LocalContainerEntityManagerFactoryBean em = new LocalContainerEntityManagerFactoryBean();
        em.setDataSource(dataSource);
        em.setPackagesToScan("es.tfg.ismaelfeito.backstellarquery.game.entity");
        em.setPersistenceUnitName("game");

        HibernateJpaVendorAdapter adapter = new HibernateJpaVendorAdapter();
        em.setJpaVendorAdapter(adapter);

        Map<String, Object> props = new HashMap<>();
        props.put("hibernate.dialect",      "org.hibernate.dialect.PostgreSQLDialect");
        props.put("hibernate.hbm2ddl.auto", "validate");
        props.put("hibernate.show_sql",     "true");
        props.put("hibernate.format_sql",   "true");
        em.setJpaPropertyMap(props);

        return em;
    }

    // 4. TransactionManager para game
    @Bean
    public PlatformTransactionManager gameTransactionManager(
            @Qualifier("gameEntityManager") LocalContainerEntityManagerFactoryBean emf) {
        EntityManagerFactory factory = emf.getObject();
        return new JpaTransactionManager(factory);
    }
}
