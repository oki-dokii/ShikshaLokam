// Sample training manual content (simulating RAG-retrieved chunks from official documents)
// In production, this would come from a vector database like Pinecone

export interface ManualChunk {
    id: string;
    title: string;
    source: string;
    content: string;
    topics: string[];
}

export interface TeacherProfile {
    region: string;
    teacherCluster: string;
    schoolType: string;
    language: string;
    grade: string;
    subject: string;
}

export interface LocalContext {
    localMetaphors: string[];
    dailyContexts: string[];
    avoidTerms: string[];
}

export const SAMPLE_MANUALS: ManualChunk[] = [
    {
        id: "ncf-active-learning-1",
        title: "Active Learning Strategies",
        source: "NCF 2023 Teacher Training Module",
        content: `Active learning is a teaching method that engages students in the learning process through activities and discussions in the classroom, as opposed to passively listening to an expert. It emphasizes critical thinking and often involves group work.

Key principles of active learning:
1. Students should be actively involved in exploring, discussing, and applying concepts
2. Teachers should act as facilitators rather than lecturers
3. Learning activities should connect to students' real-life experiences
4. Assessment should be continuous and formative

Strategies for implementation:
- Think-Pair-Share: Students think individually, discuss with a partner, then share with class
- Jigsaw method: Each group learns one part and teaches others
- Gallery walks: Students move around viewing and discussing different displays
- Exit tickets: Quick written responses at end of class to check understanding`,
        topics: ["pedagogy", "active-learning", "classroom-management"]
    },
    {
        id: "ncf-inclusive-ed-1",
        title: "Inclusive Education Practices",
        source: "NCERT Inclusive Education Guidelines",
        content: `Inclusive education means all children learn together in the same classrooms regardless of their abilities, disabilities, or backgrounds. Every child has the right to quality education.

Key inclusive practices:
1. Universal Design for Learning (UDL): Provide multiple means of engagement, representation, and expression
2. Differentiated instruction: Adapt teaching to meet diverse needs
3. Peer support systems: Pair students to help each other
4. Positive classroom environment: Create safe spaces where all feel valued

Accommodations for different learners:
- Visual learners: Use charts, diagrams, and color coding
- Auditory learners: Include songs, rhymes, and verbal instructions
- Kinesthetic learners: Hands-on activities and movement breaks
- Students with learning difficulties: Extra time, simplified instructions, buddy system`,
        topics: ["inclusive-education", "special-needs", "differentiation"]
    },
    {
        id: "state-classroom-mgmt-1",
        title: "Classroom Management Techniques",
        source: "State SCERT Classroom Management Module",
        content: `Effective classroom management creates an environment conducive to learning. It involves organizing time, space, and activities to maximize student engagement and minimize disruptions.

Essential management strategies:
1. Establish clear routines: Students should know what to expect each day
2. Set and reinforce expectations: Create simple, positive rules together with students
3. Use proximity and movement: Walk around the classroom during lessons
4. Positive reinforcement: Praise good behavior more than punishing bad behavior

Handling disruptions:
- Prevention is better than reaction
- Use non-verbal cues (eye contact, hand signals) before verbal interventions
- Speak privately with persistently disruptive students
- Involve parents early if behavior continues
- Document incidents for support if needed`,
        topics: ["classroom-management", "discipline", "behavior"]
    },
    {
        id: "nep-foundational-literacy-1",
        title: "Foundational Literacy and Numeracy",
        source: "NEP 2020 FLN Mission Guidelines",
        content: `Foundational literacy means children can read with comprehension and write with meaning by Grade 3. Foundational numeracy means children can perform basic mathematical operations and understand mathematical reasoning.

Key FLN strategies:
1. Print-rich environment: Display labels, charts, and student work with text
2. Read-aloud sessions: Daily reading by teacher with expression and discussion
3. Phonemic awareness: Help children hear and manipulate sounds in words
4. Number sense: Use concrete materials before abstract symbols

Daily FLN activities:
- Morning message: Write a simple message on board daily
- Shared reading: Read big books together pointing to words
- Math manipulatives: Use locally available items (stones, sticks, seeds) for counting
- Word walls: Display new words learned each week
- Number of the day: Explore one number in different ways daily`,
        topics: ["literacy", "numeracy", "foundational-learning", "primary"]
    },
    {
        id: "assessment-formative-1",
        title: "Formative Assessment Strategies",
        source: "CBSE Assessment Guidelines 2024",
        content: `Formative assessment is ongoing assessment during the learning process. It helps teachers understand what students know and adjust teaching accordingly. Unlike summative assessment (final exams), formative assessment is for learning, not of learning.

Formative assessment techniques:
1. Observation: Watch and note student behavior during activities
2. Questioning: Ask open-ended questions to probe understanding
3. Self-assessment: Students reflect on their own learning
4. Peer assessment: Students give feedback to each other

Quick formative assessment ideas:
- Thumbs up/down/sideways: Quick check of understanding
- Traffic light cards: Green (I understand), Yellow (I'm unsure), Red (I need help)
- One-minute paper: Write one thing learned and one question
- Muddiest point: What was most confusing today?
- Quiz games: Fun, low-stakes quiz competitions`,
        topics: ["assessment", "formative-assessment", "evaluation"]
    },
    {
        id: "parent-engagement-1",
        title: "Parent and Community Engagement",
        source: "Samagra Shiksha Parent Engagement Framework",
        content: `Strong school-home partnerships improve student learning outcomes. Parents are children's first teachers and their involvement matters greatly.

Strategies for parent engagement:
1. Regular communication: Send updates through accessible means (WhatsApp, notes, personal meetings)
2. Parent-teacher meetings: Schedule at times working parents can attend
3. Home visits: Visit homes to understand student context
4. School events: Invite parents to celebrations and learning showcases

Overcoming barriers:
- For working parents: Flexible meeting times, weekend events
- For non-literate parents: Verbal communication, visual materials
- For shy parents: Small group meetings, home visits
- For distant parents: Phone calls, voice messages

Community involvement:
- Local experts as guest speakers
- Community resources for learning (markets, farms, workshops)
- Village/ward education committees
- Alumni networks for mentoring`,
        topics: ["parent-engagement", "community", "communication"]
    }
];

// Region-specific context data
export const REGION_CONTEXTS: Record<string, LocalContext> = {
    "rural-chhattisgarh": {
        localMetaphors: [
            "farming seasons (sowing, harvesting)",
            "village well gathering",
            "local mela/fair",
            "paddy cultivation steps",
            "jungle (forest) resources"
        ],
        dailyContexts: [
            "farming activities",
            "morning cattle care",
            "weekly haat (market)",
            "seasonal festivals",
            "joint family responsibilities"
        ],
        avoidTerms: [
            "cognitive load",
            "metacognition",
            "scaffolding (use 'step-by-step help')",
            "pedagogy (use 'teaching method')",
            "differentiated instruction (use 'teaching each child differently')"
        ]
    },
    "tribal-bastar": {
        localMetaphors: [
            "forest gathering",
            "community dance and music",
            "tribal craft making",
            "seasonal fruit collection",
            "river and stream activities"
        ],
        dailyContexts: [
            "forest produce collection",
            "traditional craft work",
            "community celebrations",
            "walking long distances",
            "multi-age family care"
        ],
        avoidTerms: [
            "mainstream curriculum",
            "standard Hindi",
            "urban examples",
            "technology-based",
            "individual competition"
        ]
    },
    "semi-urban-raipur": {
        localMetaphors: [
            "local market shopping",
            "auto-rickshaw journeys",
            "neighborhood activities",
            "small shop management",
            "construction work"
        ],
        dailyContexts: [
            "mixed occupation families",
            "daily wage work",
            "small businesses",
            "mobile phone usage",
            "migration for work"
        ],
        avoidTerms: [
            "high-tech resources",
            "expensive materials",
            "English-only examples",
            "corporate settings",
            "complex theories"
        ]
    },
    "default": {
        localMetaphors: [
            "cooking and kitchen activities",
            "games children play",
            "local festivals",
            "family gatherings",
            "daily market activities"
        ],
        dailyContexts: [
            "home responsibilities",
            "community events",
            "seasonal changes",
            "local transportation",
            "daily routines"
        ],
        avoidTerms: [
            "jargon",
            "academic terms",
            "complex theories",
            "foreign examples",
            "expensive resources"
        ]
    }
};

// School types
export const SCHOOL_TYPES = [
    "Government Primary School",
    "Government Middle School",
    "Government High School",
    "Ashram School (Residential)",
    "Eklavya Model School",
    "Kasturba Gandhi Balika Vidyalaya"
];

// Languages
export const INSTRUCTION_LANGUAGES = [
    "Hindi",
    "Chhattisgarhi",
    "Gondi",
    "Halbi",
    "English",
    "Hindi + Local Dialect"
];

// Grade levels
export const GRADE_LEVELS = [
    "Grade 1-2 (Foundational)",
    "Grade 3-5 (Preparatory)",
    "Grade 6-8 (Middle)",
    "Grade 9-10 (Secondary)",
    "Grade 11-12 (Senior Secondary)"
];

// Subjects
export const SUBJECTS = [
    "Mathematics",
    "Hindi Language",
    "English Language",
    "Environmental Studies (EVS)",
    "Science",
    "Social Science",
    "General / All Subjects"
];
