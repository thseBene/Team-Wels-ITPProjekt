FROM maven:3.9-eclipse-temurin-19-alpine

WORKDIR /app
COPY .  .

RUN mvn package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/quarkus-app/quarkus-run.jar"]