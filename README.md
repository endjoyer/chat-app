# WhatsApp Web Clone

A React-based WhatsApp Web clone that uses the GREEN-API service for sending and receiving messages. This application provides a simplified interface similar to WhatsApp Web, allowing users to communicate through WhatsApp without keeping their phone online.

## Features

- 💬 Real-time messaging using GREEN-API
- 🔒 Secure authentication with GREEN-API credentials
- 📱 Responsive design similar to WhatsApp Web
- 💾 Local storage for chats and messages persistence
- ⚡ Message throttling to prevent API rate limiting
- 🔄 Auto-scrolling chat with manual override
- 📋 Chat history loading
- 🔔 Real-time notifications for new messages

## Technologies Used

- React 18
- TypeScript
- Redux Toolkit for state management
- React Router for navigation
- Axios for API requests
- SCSS Modules for styling
- Local Storage for data persistence

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- GREEN-API account credentials (idInstance and apiTokenInstance)

## Installation

1. Clone the repository:

```
git clone https://github.com/yourusername/whatsapp-web-clone.git cd whatsapp-web-clone
```

2. Install dependencies:

```
npm install
```

3. Start the development server:

```
npm start
```

The application will be available at `http://localhost:3000`

## Configuration

Before using the application, you need to:

1. Create an account at [GREEN-API](https://green-api.com/)
2. Get your `idInstance` and `apiTokenInstance`
3. Connect a WhatsApp account following GREEN-API instructions

## Usage

1. Open the application in your browser
2. Enter your GREEN-API credentials (idInstance and apiTokenInstance)
3. After successful authentication, you can:
   - Start new chats by entering a phone number
   - Send and receive messages
   - View chat history
   - Receive real-time notifications

## Project Structure

```plaintext
src/
├── components/
│   ├── common/        # Переиспользуемые компоненты
│   └── features/      # Компоненты, специфичные для фич
├── hooks/            # Кастомные React-хуки
├── services/         # API и сервисный слой
├── store/            # Конфигурация Redux-хранилища
├── types/            # Типы и интерфейсы TypeScript
└── utils/            # Утилитные функции
```

## API Rate Limiting

The application implements request throttling to comply with GREEN-API's rate limits:

- Minimum 2 seconds between requests
- Automatic retry on rate limit errors
- Request queuing for better performance

## Acknowledgments

- [GREEN-API](https://green-api.com/) for providing the WhatsApp API
- WhatsApp Web for interface inspiration
