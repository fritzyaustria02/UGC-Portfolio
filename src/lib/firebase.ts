/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Public Firebase config provisioned for your app
const firebaseConfig = {
  apiKey: "AIzaSyCrmVCmQZdGr-v9IWAHq7INHGBtl6_WgsM",
  authDomain: "hypnic-bay-0zp7b.firebaseapp.com",
  projectId: "hypnic-bay-0zp7b",
  storageBucket: "hypnic-bay-0zp7b.firebasestorage.app",
  messagingSenderId: "549595088452",
  appId: "1:549595088452:web:5e01c47020212fc600de11"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore using custom multi-tenant database ID
export const db = getFirestore(app, "ai-studio-13de5a34-049f-4cc2-94fa-b0a707f786a9");
