# ------------ Build Stage ------------
FROM maven:3.9.9-eclipse-temurin-21 AS builder

WORKDIR /app

COPY pom.xml .
RUN mvn -B dependency:go-offline

COPY src ./src
RUN mvn -B clean package -DskipTests


# ------------ Runtime Stage ------------
FROM eclipse-temurin:21-jre-alpine AS runner

WORKDIR /app

# Set JAVA memory limits (reduce memory usage)
ENV JAVA_OPTS="-XX:+UseSerialGC -Xms128m -Xmx512m"

COPY --from=builder /app/target/ai-service-0.0.1-SNAPSHOT.jar app.jar

# Expose your ports (HTTP + gRPC)
EXPOSE 4002
EXPOSE 5002

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
