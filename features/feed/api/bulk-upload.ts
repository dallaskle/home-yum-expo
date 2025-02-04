import { Video } from '@/types/database.types';
import { auth } from '@/config/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const COOKING_ADJECTIVES = [
  'Sizzling', 'Crispy', 'Creamy', 'Spicy', 'Fresh', 'Homestyle', 'Gourmet', 'Quick', 
  'Healthy', 'Tasty', 'Savory', 'Sweet', 'Delicious', 'Easy', 'Classic'
];

const MEAL_TYPES = [
  'Pasta', 'Stir-fry', 'Salad', 'Bowl', 'Sandwich', 'Curry', 'Soup', 'Casserole',
  'Rice Dish', 'Noodles', 'Tacos', 'Pizza', 'Burger', 'Wrap', 'Breakfast'
];

const MEAL_DESCRIPTIONS = [
  'A perfect weeknight dinner that comes together in minutes!',
  'Packed with flavor and super easy to make.',
  'A healthy twist on a classic favorite.',
  'Your new go-to comfort food recipe.',
  'Quick, easy, and absolutely delicious!',
  'A crowd-pleasing recipe that never fails.',
  'Perfect for meal prep and busy weekdays.',
  'Restaurant quality meal made right at home.',
  'Simple ingredients, amazing results!',
  'A must-try recipe for any home cook.'
];

export class BulkUploadAPI {
  private static generateRandomTitle(): string {
    const adj = COOKING_ADJECTIVES[Math.floor(Math.random() * COOKING_ADJECTIVES.length)];
    const meal = MEAL_TYPES[Math.floor(Math.random() * MEAL_TYPES.length)];
    return `${adj} ${meal}`;
  }

  private static generateRandomDescription(): string {
    return MEAL_DESCRIPTIONS[Math.floor(Math.random() * MEAL_DESCRIPTIONS.length)];
  }

  static async uploadToFirebase(videoUrl: string): Promise<Video> {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error('Not authenticated');
    }

    const thumbnailUrl = videoUrl.replace('.MP4', '-thumb.jpg');
    const videoTitle = this.generateRandomTitle();
    const mealName = videoTitle;
    const mealDescription = this.generateRandomDescription();
    const now = new Date();

    const db = getFirestore();
    const videoData = {
      userId,
      videoTitle,
      videoDescription: `Quick and easy recipe: ${videoTitle}`,
      mealName,
      mealDescription,
      videoUrl,
      thumbnailUrl,
      duration: 0,
      source: 'TikTok',
      uploadedAt: now
    };

    console.log('Creating Firebase document:', videoData);

    try {
      const docRef = await addDoc(collection(db, 'videos'), videoData);
      console.log('Document created with ID:', docRef.id);
      return { ...videoData, videoId: docRef.id };
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  static async bulkUploadVideos(videoUrls: string[]): Promise<Video[]> {
    console.log('Starting bulk upload process...');
    const results: Video[] = [];

    try {
      for (const url of videoUrls) {
        try {
          const video = await this.uploadToFirebase(url);
          console.log('Successfully created video entry for:', url);
          results.push(video);
        } catch (error) {
          console.error('Failed to create video entry for:', url, error);
          // Continue with next URL even if one fails
        }
      }
      
      return results;
    } catch (error) {
      console.error('Failed to complete bulk upload:', error);
      throw error;
    }
  }

  static async uploadProvidedVideos() {
    const videoUrls = [
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctbhp2nog65pgtgbgah0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cthi7pnog65ser192010.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctk9ftvog65qag8b7dv0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctlgjafog65u2a11k27g.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cto8s9nog65ma543loag.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctoq59vog65s4svnesag.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctpfounog65ms2m9etp0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctqrq2nog65ggl6f01mg.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cttd36fog65k82tf9v40.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000ctubktfog65kh5rdihf0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu361cnog65hqbefdkf0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu48vrnog65tv00t9t8g.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu6lrvnog65ikaluajmg.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu87oc7og65iaftjinjg.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu93p5fog65ie05tejr0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cu9hilnog65io54hisn0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cua0m6nog65n48s8csb0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cud7vdvog65sf3hao5e0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cueh48vog65i3evc8jkg.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cuf56lfog65ikaha41v0.MP4',
      'https://yorkqnzggaaepybsjijl.supabase.co/storage/v1/object/public/home-yum/tiktok/v15044gf0000cufuon7og65ob0ems390.MP4'
    ];

    return this.bulkUploadVideos(videoUrls);
  }
} 