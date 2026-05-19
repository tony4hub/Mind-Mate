// Resource matching based on conversation context
import { Resource } from '@/types';

export function getRecommendedResources(topics: string[]): Resource[] {
  const allResources: Record<string, Resource[]> = {
    anxiety: [
      {
        id: 'anxiety-1',
        title: '5-Minute Breathing Exercise',
        description: 'A simple guided breathing technique to help calm anxiety and reduce stress',
        type: 'exercise',
      },
      {
        id: 'anxiety-2',
        title: 'Understanding Anxiety Disorders',
        description: 'Learn about different types of anxiety and evidence-based coping strategies',
        url: 'https://www.nimh.nih.gov/health/topics/anxiety-disorders',
        type: 'article',
      },
      {
        id: 'anxiety-3',
        title: 'Grounding Techniques for Anxiety',
        description: 'Practical exercises to help you stay present when anxiety feels overwhelming',
        type: 'exercise',
      },
    ],
    sleep: [
      {
        id: 'sleep-1',
        title: 'Sleep Hygiene Guide',
        description: 'Evidence-based tips for improving your sleep quality and establishing healthy routines',
        url: 'https://www.sleepfoundation.org/sleep-hygiene',
        type: 'article',
      },
      {
        id: 'sleep-2',
        title: 'Progressive Muscle Relaxation',
        description: 'A relaxation technique that can help you fall asleep more easily',
        type: 'exercise',
      },
      {
        id: 'sleep-3',
        title: 'Sleep and Mental Health',
        description: 'Understanding the connection between sleep and emotional wellbeing',
        type: 'article',
      },
    ],
    stress: [
      {
        id: 'stress-1',
        title: 'Stress Management Techniques',
        description: 'Practical strategies for managing daily stress and building resilience',
        type: 'article',
      },
      {
        id: 'stress-2',
        title: 'Mindful Journaling Prompts',
        description: 'Guided prompts to help you process emotions and reduce stress',
        type: 'exercise',
      },
      {
        id: 'stress-3',
        title: 'Understanding Burnout',
        description: 'Recognize the signs of burnout and learn how to recover',
        url: 'https://www.apa.org/topics/burnout',
        type: 'article',
      },
    ],
    depression: [
      {
        id: 'depression-1',
        title: 'Understanding Depression',
        description: 'Learn about depression symptoms, causes, and treatment options',
        url: 'https://www.nimh.nih.gov/health/topics/depression',
        type: 'article',
      },
      {
        id: 'depression-2',
        title: 'Behavioral Activation Exercise',
        description: 'A technique to help increase positive activities and improve mood',
        type: 'exercise',
      },
      {
        id: 'depression-3',
        title: 'Self-Care for Depression',
        description: 'Gentle self-care practices that can support your mental health',
        type: 'article',
      },
    ],
    crisis: [
      {
        id: 'crisis-1',
        title: 'Crisis Resources',
        description: 'Immediate help and support for mental health emergencies',
        type: 'article',
      },
      {
        id: 'crisis-2',
        title: 'Safety Planning',
        description: 'Creating a plan to keep yourself safe during difficult times',
        type: 'article',
      },
    ],
  };

  // Collect resources based on topics
  const resources: Resource[] = [];
  const seenIds = new Set<string>();

  topics.forEach((topic) => {
    const topicResources = allResources[topic] || [];
    topicResources.forEach((resource) => {
      if (!seenIds.has(resource.id)) {
        resources.push(resource);
        seenIds.add(resource.id);
      }
    });
  });

  // If no specific topics, return general wellness resources
  if (resources.length === 0) {
    return [
      {
        id: 'general-1',
        title: 'Mental Health Basics',
        description: 'Understanding mental health and wellbeing fundamentals',
        url: 'https://www.mentalhealth.gov/basics',
        type: 'article',
      },
      {
        id: 'general-2',
        title: 'Daily Mindfulness Practice',
        description: 'Simple mindfulness exercises you can do anywhere',
        type: 'exercise',
      },
    ];
  }

  return resources.slice(0, 4); // Limit to 4 resources
}
