export interface AuthCredentials {
  idInstance: string;
  apiTokenInstance: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: number;
  fromMe: boolean;
}

export interface Chat {
  id: string; // phone number
  name: string;
  lastMessage?: Message;
}

export interface Notification {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    idMessage: string;
    senderData: {
      chatId: string;
      sender: string;
      senderName: string;
    };
    messageData: {
      typeMessage: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}
