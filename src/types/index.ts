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
  id: string;
  name: string;
  lastMessage: string;
  timestamp: number;
  unread: boolean;
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

export interface ApiChat {
  archive: boolean;
  id: string;
  notSpam: boolean;
  ephemeralExpiration: number;
  ephemeralSettingTimestamp: number;
  name?: string;
}
