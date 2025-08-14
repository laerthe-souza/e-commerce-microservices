lint:
	cd ./services/events-failure-ms && yarn lint
	cd ./services/orders-ms && yarn lint
	cd ./services/notifications-ms && yarn lint
	cd ./services/payments-ms && yarn lint
	cd ./services/catalog-ms && yarn lint

build:
	cd ./services/events-failure-ms && yarn build
	cd ./services/orders-ms && yarn build
	cd ./services/notifications-ms && yarn build
	cd ./services/payments-ms && yarn build
	cd ./services/catalog-ms && yarn build

validate-env-example:
	cd ./services/events-failure-ms && yarn validate-env-example
	cd ./services/orders-ms && yarn validate-env-example
	cd ./services/notifications-ms && yarn validate-env-example
	cd ./services/payments-ms && yarn validate-env-example
	cd ./services/payments-ms && yarn validate-env-example