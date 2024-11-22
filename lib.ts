import {NativeModules} from 'react-native';

const {PrinterModule} = NativeModules;

interface PrinterModuleType {
  connectBt: (macAddress: string) => Promise<string>;
  disconnect: () => Promise<string>;
  initializePrinter: (width: number, height: number) => Promise<string>;
  addText: (x: number, y: number, text: string) => Promise<string>;
  addImage: (imageUrl: string, x: number, y: number) => Promise<string>;
  addSpeed: (speed: number) => Promise<string>;
  addBeep: (seconds: number) => Promise<string>;
  addPageWidth: (width: number) => Promise<string>;
  print: () => Promise<string>;
}

const PrinterModuleTyped = PrinterModule as PrinterModuleType;

const connectBt = async (macAddress: string) => {
  try {
    const result = await PrinterModuleTyped.connectBt(macAddress);
    return result;
  } catch (e) {
    console.error(e);
  }
};

const disconnect = async () => {
  try {
    const result = await PrinterModuleTyped.disconnect();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const initializePrinter = async (width: number, height: number) => {
  try {
    const result = await PrinterModuleTyped.initializePrinter(width, height);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const addText = async (x: number, y: number, text: string) => {
  try {
    const result = await PrinterModuleTyped.addText(x, y, text);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const addImage = async (imageUrl: string, x: number, y: number) => {
  try {
    const result = await PrinterModuleTyped.addImage(imageUrl, x, y);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const print = async () => {
  try {
    const result = await PrinterModuleTyped.print();
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

type Speed = 1 | 2 | 3 | 4 | 5;

const addSpeed = async (speed: Speed) => {
  try {
    const result = await PrinterModuleTyped.addSpeed(speed);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const addBeep = async (seconds: number) => {
  try {
    const result = await PrinterModuleTyped.addBeep(seconds);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

const addPageWidth = async (width: number) => {
  try {
    const result = await PrinterModuleTyped.addPageWidth(width);
    console.log(result);
  } catch (e) {
    console.error(e);
  }
};

export {connectBt, disconnect, initializePrinter, addText, addImage, print, addSpeed, addBeep, addPageWidth};
