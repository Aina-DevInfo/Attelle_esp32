
// ===================================
// 📁 components/BluetoothUI.tsx
// Version mise à jour utilisant les 2 nouveaux composants
// ===================================
import React from 'react';
import { BluetoothDevice } from 'react-native-bluetooth-classic';
import { DeviceScanner } from './DeviceScanner';
import { ConnectedDevicePanel } from './ConnectedDevicePanel';

interface BluetoothUIProps {
  isConnected: boolean;
  isScanning: boolean;
  paired: BluetoothDevice[];
  selectedDevice?: BluetoothDevice;
  messageToSend: string;
  receivedMessage: string;
  onScan: () => void;
  onConnect: (device: BluetoothDevice) => void;
  onDisconnect: () => void;
  onSendMessage: () => void;
  onMessageChange: (text: string) => void;
}

export const BluetoothUI: React.FC<BluetoothUIProps> = ({
  isConnected,
  isScanning,
  paired,
  selectedDevice,
  messageToSend,
  receivedMessage,
  onScan,
  onConnect,
  onDisconnect,
  onSendMessage,
  onMessageChange,
}) => {

  
  return (
    <>
      {!isConnected && (
        <DeviceScanner
          isScanning={isScanning}
          paired={paired}
          onScan={onScan}
          onConnect={onConnect}
        />
      )}


      {selectedDevice && isConnected && (
        <ConnectedDevicePanel
          selectedDevice={selectedDevice}
          messageToSend={messageToSend}
          receivedMessage={receivedMessage}
          isConnected={isConnected}
          onDisconnect={onDisconnect}
          onSendMessage={onSendMessage}
          onMessageChange={onMessageChange}
        />

      )}
    </>
  );
};