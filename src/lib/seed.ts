import { useState, useEffect } from 'react';
import { collection, doc, setDoc, getDocs, query, where, deleteDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';

const SAMPLE_BOOKS = [
  {
    title: "The Midnight Library",
    author: "Matt Haig",
    description: "Between life and death there is a library, and within that library, the shelves go on forever. Every book provides a chance to try another life you could have lived.",
    genre: "Fiction",
    price: 14.99,
    coverImage: "https://picsum.photos/seed/midnight/400/600",
    rating: 4.5,
    trending: true,
    newRelease: false,
    editorsPick: true
  },
  {
    title: "Project Hail Mary",
    author: "Andy Weir",
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.",
    genre: "Science Fiction",
    price: 18.50,
    coverImage: "https://picsum.photos/seed/hailmary/400/600",
    rating: 4.8,
    trending: true,
    newRelease: true,
    editorsPick: false
  },
  {
    title: "The Silent Patient",
    author: "Alex Michaelides",
    description: "Alicia Berenson’s life is seemingly perfect. A famous painter married to an in-demand fashion photographer, she lives in a grand house with big windows overlooking a park in one of London’s most desirable areas.",
    genre: "Thriller",
    price: 12.99,
    coverImage: "https://picsum.photos/seed/silent/400/600",
    rating: 4.2,
    trending: false,
    newRelease: false,
    editorsPick: true
  },
  {
    title: "Circe",
    author: "Madeline Miller",
    description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child—not powerful, like her father, nor viciously alluring like her mother.",
    genre: "Fantasy",
    price: 15.99,
    coverImage: "https://picsum.photos/seed/circe/400/600",
    rating: 4.7,
    trending: true,
    newRelease: false,
    editorsPick: false
  },
  {
    title: "Atomic Habits",
    author: "James Clear",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    genre: "Self-Development",
    price: 16.99,
    coverImage: "https://picsum.photos/seed/habits/400/600",
    rating: 4.9,
    trending: true,
    newRelease: false,
    editorsPick: true
  }
];

export async function seedDatabase() {
  const booksCol = collection(db, 'books');
  const snapshot = await getDocs(booksCol);
  
  if (snapshot.empty) {
    console.log('Seeding database with sample books...');
    for (const book of SAMPLE_BOOKS) {
      try {
        await addDoc(booksCol, book);
      } catch (error) {
        handleFirestoreError(error, OperationType.CREATE, 'books');
      }
    }
  }
}
