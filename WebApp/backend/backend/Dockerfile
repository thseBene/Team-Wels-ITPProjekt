FROM maven:3.9-eclipse-temurin-21-alpine

WORKDIR /app

# Dependencies-Layer (cached!)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Build-Layer (nur bei Code-Änderung neu)
COPY src ./src
RUN mvn package -DskipTests -B

EXPOSE 8080
CMD ["java", "-jar", "target/quarkus-app/quarkus-run.jar"]