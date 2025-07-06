package utils

import (
	"context"
	"fmt"
	"time"

	"github.com/jolneetanky/dateideas/apps/backend/api/app/lib/logger"
	amqp "github.com/rabbitmq/amqp091-go"
)

var RabbitMQClient *RabbitMQ

// STRUCT TO STORE RABBITMQ CONNECTION AND CHANNEL
type RabbitMQ struct {
	Conn    *amqp.Connection
	Channel *amqp.Channel
}

// FUNCTION TO CREATE A NEW RABBITMQ CONNECTION AND CHANNEL
func NewRabbitMQConnection() error {

	// CONNECT TO RABBITMQ
	logger.Info("Connecting to RabbitMQ server...")
	conn, err := amqp.Dial("amqp://guest:guest@localhost:5672/")
	if err != nil {
		logger.Error(fmt.Sprintf("Error connecting to RabbitMQ Server: %s", err.Error()))
		return err
	}

	// defer conn.Close()

	// OPEN A RABBITMQ CHANNEL
	logger.Info("Creating a channel...")
	ch, err := conn.Channel()
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to open a channel: %s", err.Error()))
		return err
	}

	// defer ch.Close()

	// STORE RABBITMQ CONNECTION AND CHANNEL
	RabbitMQClient = &RabbitMQ{
		Conn:    conn,
		Channel: ch,
	}

	return nil
}

// Implement methods for `RabbitMQ` struct
func (r *RabbitMQ) SendMessage(message []byte) error {

	ch := RabbitMQClient.Channel

	// Declare a queue to send to (diff from creating a queue!!)
	q, err := ch.QueueDeclare(
		"job_queue", // name
		true,        // durable
		false,       // delete when unused
		false,       // exclusive
		false,       // no-wait
		nil,         // arguments
	)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to declare a queue: %s", err.Error()))
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	body := message
	err = ch.PublishWithContext(ctx,
		"",     // exchange
		q.Name, // routing key
		false,  // mandatory
		false,  // immediate
		amqp.Publishing{
			ContentType: "application/json",
			Body:        body,
		},
	)

	if err != nil {
		logger.Error(fmt.Sprintf("Failed to publish a message: %s", err.Error()))
		return err
	}

	logger.Info("Successfully published message")
	return nil
}
