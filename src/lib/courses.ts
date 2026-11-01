// Placeholder course data — replace fees/schedules with real values.
export const BATCHES = ["All Batches", "HSC 28", "HSC 27", "HSC 26", "HSC 25", "SSC 27", "Revision", "Pre Admission", "Admission", "Others"] as const;
export const SUBJECTS = ["All Subjects", "Physics", "Mathematics", "Chemistry", "Biology", "Medical", "Engineering", "ICT", "English", "Bangla", "EBI", "School", "Others"] as const;

export type Course = {
  id: string;
  title: string;
  category: "Academic" | "Admission";
  icon: "book" | "cap" | "steth" | "gear" | "spark";
  short: string;
  description: string;
  batch: string;
  batches: string[];
  subjects: string[];
  faculty: string;
  fee: number | null; // null = to be announced
  schedule: string;
  curriculum: string[];
};

export const COURSES: Course[] = [
  {
    id: "ssc-academic", title: "SSC Academic Program", category: "Academic", icon: "book",
    short: "Build strong fundamentals and prepare with a structured learning path.",
    description: "A complete SSC program covering the full board syllabus with concept classes, practice sessions and regular model tests.",
    batch: "SSC 2027", batches: ["SSC 27", "School"], subjects: ["Physics", "Mathematics", "Chemistry", "Biology", "English", "Bangla", "ICT", "School"],
    faculty: "STUDY ROOM Faculty", fee: null, schedule: "To be announced",
    curriculum: ["Concept classes by chapter", "Weekly practice sheets", "Monthly model tests", "Board-pattern final revision"],
  },
  {
    id: "hsc-academic", title: "HSC Academic Program", category: "Academic", icon: "cap",
    short: "Concept-focused, in-depth and guided preparation for your HSC journey.",
    description: "In-depth HSC preparation across science subjects with guided problem solving and exam strategy.",
    batch: "HSC 2027", batches: ["HSC 28", "HSC 27", "HSC 26", "HSC 25", "Revision"], subjects: ["Physics", "Mathematics", "Chemistry", "Biology", "ICT", "English", "Bangla", "EBI"],
    faculty: "STUDY ROOM Faculty", fee: null, schedule: "To be announced",
    curriculum: ["1st & 2nd paper full syllabus", "Creative question practice", "MCQ drills", "Revision crash sessions"],
  },
  {
    id: "medical-admission", title: "Medical Admission Prep", category: "Admission", icon: "steth",
    short: "Prepare for medical admission with a focused, step-by-step study plan.",
    description: "Focused preparation for medical admission tests with subject-wise MCQ mastery and full mock exams.",
    batch: "Medical Batch", batches: ["Pre Admission", "Admission"], subjects: ["Medical", "Biology", "Chemistry", "Physics", "English"],
    faculty: "STUDY ROOM Faculty", fee: null, schedule: "To be announced",
    curriculum: ["Biology deep dive", "Chemistry & Physics MCQ", "General knowledge & English", "Full-length mock tests"],
  },
  {
    id: "engineering-admission", title: "Engineering Admission Prep", category: "Admission", icon: "gear",
    short: "Sharpen your problem-solving skills and prepare for engineering admission.",
    description: "Rigorous problem-solving practice for engineering admission tests with written and MCQ formats.",
    batch: "Engineering Batch", batches: ["Pre Admission", "Admission"], subjects: ["Engineering", "Physics", "Mathematics", "Chemistry"],
    faculty: "STUDY ROOM Faculty", fee: null, schedule: "To be announced",
    curriculum: ["Advanced math problem sets", "Physics written problems", "Chemistry numericals", "Timed mock exams"],
  },
  {
    id: "more-courses", title: "More Courses", category: "Academic", icon: "spark",
    short: "More learning opportunities will be added here. Stay tuned for updates.",
    description: "New programs are on the way. Join our Telegram community to hear first.",
    batch: "New Batch", batches: ["Others"], subjects: ["Others"],
    faculty: "STUDY ROOM Faculty", fee: null, schedule: "To be announced",
    curriculum: ["Coming soon"],
  },
];

export function filterCourses(courses: Course[], batch: string, subject: string, query: string) {
  const q = query.trim().toLowerCase();
  return courses.filter((c) =>
    (batch === "All Batches" || c.batches.includes(batch)) &&
    (subject === "All Subjects" || c.subjects.includes(subject)) &&
    (!q || [c.title, c.batch, ...c.batches, ...c.subjects].some((s) => s.toLowerCase().includes(q))),
  );
}

export const formatFee = (fee: number | null) => (fee == null ? "৳ TBA" : `৳ ${fee.toLocaleString("en-IN")}`);

// Connected to @STUDY_ROOM_MY_bot
export const TELEGRAM_USERNAME = "STUDY_ROOM_MY_bot";
export const telegramLink = (text?: string) =>
  TELEGRAM_USERNAME ? `https://t.me/${TELEGRAM_USERNAME}${text ? `?text=${encodeURIComponent(text)}` : ""}` : null;

const STORAGE_KEY = "studyroom_admin_courses";

/** Load courses — prefers admin-edited data from localStorage */
export function getCourses(): Course[] {
  if (typeof window === "undefined") return COURSES;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as Course[];
      if (Array.isArray(parsed) && parsed.length) return parsed;
    }
  } catch {}
  return COURSES;
}
