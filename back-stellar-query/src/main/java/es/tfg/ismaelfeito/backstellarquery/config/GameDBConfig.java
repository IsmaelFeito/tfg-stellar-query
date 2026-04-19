package es.tfg.ismaelfeito.backstellarquery.config;

import jakarta.persistence.EntityManagerFactory;
import org.hibernate.jpa.boot.spi.EntityManagerFactoryBuilder;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.autoconfigure.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.orm.jpa.JpaTransactionManager;
import org.springframework.orm.jpa.LocalContainerEntityManagerFactoryBean;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@EnableJpaRepositories(
        basePackages = "es.tfg.ismaelfeito.backstellarquery.game",   // paquete de tus repos de juego
        entityManagerFactoryRef = "gameEntityManager",
        transactionManagerRef   = "gameTransactionManager"
)
public class GameDBConfig {

    @Bean
    @ConfigurationProperties(prefix = "spring.datasource.game")
    public DataSourceProperties gameDataSourceProperties() {
        return new DataSourceProperties();
    }

    @Bean
    public DataSource gameDataSource() {
        return gameDataSourceProperties()
                .initializeDataSourceBuilder()
                .build();
    }

    @Bean
    public LocalContainerEntityManagerFactoryBean gameEntityManager(
            EntityManagerFactoryBuilder builder) {
        return builder
                .dataSource(gameDataSource())
                .packages("es.tfg.ismaelfeito.backstellarquery.game.entity")
                .persistenceUnit("game")
                .build();
    }

    @Bean
    public PlatformTransactionManager gameTransactionManager(
            @Qualifier("gameEntityManager") EntityManagerFactory emf) {
        return new JpaTransactionManager(emf);
    }
}