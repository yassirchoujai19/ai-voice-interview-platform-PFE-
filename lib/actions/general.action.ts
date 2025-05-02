import { feedbackSchema } from "@/constants";
import { db,auth  } from "@/firebase/admin";
import { google } from "@ai-sdk/google";
import { generateObject } from "ai";


export async function getInterviewByUserId(userId:string): Promise<Interview[] | null> {
    const interviews = await db
    .collection('iterviews')
    .where('userId' , '==' , userId)
    .orderBy('createdAt' , 'desc')
    .get();

    return interviews.docs.map((doc) => ({
        id: doc.id,
        ... doc.data()
    })) as Interview[];
}
export async function getLatestInterviews(params:GetLatestInterviewsParams) : Promise<Interview[] | null> {
    const {userId, limit = 20} = params;
    
    const interviews = await db
    .collection('iterviews') 
    .orderBy('createdAt' , 'desc')
    .where('finalized' ,'==', true )
    .where('userId' ,'!=', userId )
    .limit(limit)

    .get();

    return interviews.docs.map((doc) => ({
        id : doc.id,
        ... doc.data()
    })) as Interview[];
}

export async function getInterviewById(id:string): Promise<Interview | null> {
const interview = await db
    .collection('iterviews')
    .doc(id)
    .get();

    return interview.data() as Interview | null;
}

export async function createFeedback(params : CreateFeedbackParams){
    const {interviewId, userId, transcript} = params;

    try{
    const formattedTranscript = transcript
    .map((sentance :{role : string; content :string}) => (
    
    `- ${sentance.role} : ${sentance.content}\n`
    )).join('');


    const { object :{ totalScore, categoryScores , strengths , areasForImprovement, finalAssessment }} = await generateObject({
        model : google('gemini-2.0-flash-001', {
            structuredOutputs: false,
        }),
        schema: feedbackSchema,
        prompt: `
        You are an AI interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories. Be thorough and detailed in your analysis. Don't be lenient with the candidate. If there are mistakes or areas for improvement, point them out.
        Transcript:
        ${formattedTranscript}

        Please score the candidate from 0 to 100 in the following areas. Do not add categories other than the ones provided:
        - **Communication Skills**: Clarity, articulation, structured responses.
        - **Technical Knowledge**: Understanding of key concepts for the role.
        - **Problem-Solving**: Ability to analyze problems and propose solutions.
        - **Cultural & Role Fit**: Alignment with company values and job role.
        - **Confidence & Clarity**: Confidence in responses, engagement, and clarity.
        `,
      system:
        "You are a professional interviewer analyzing a mock interview. Your task is to evaluate the candidate based on structured categories",
    })


    const feedback = await db.collection('feedback').add({
        interviewId,
        userId,
        totalScore,
        categoryScores,
        strengths,
        areasForImprovement,
        finalAssessment,
        createdAt: new Date().toString()
    })


    return{
        success : true,
        feedbackId : feedback.id
    }
    
    }catch (e){
console.log('Error saving feedback', e)
    }
}