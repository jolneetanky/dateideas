# Use Go base image
FROM golang:1.23.4 as builder

# set working directory in docker container. (NOT from your `app/` directory!!)
WORKDIR /app
# This copies all files in /api (including ./app/, go.mod, etc.) into /app
COPY . .

RUN go mod download
# RUN go build -o main ./main.go  # update path if needed

# static build
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main .

# Final runtime container
# Use a minimal runtimei image
# Copies the built binary (main) from the builder stage into the final image.
FROM gcr.io/distroless/base-debian11
WORKDIR /app
COPY --from=builder /app/main .
# COPY .env .

EXPOSE 8080

# This tells Docker what to run when the container starts.
CMD ["./main"]
