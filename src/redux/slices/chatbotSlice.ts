import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatbotState {
  response: string | null;
  loading: boolean;
  error: string | null;
  errorStatus: number | null;
}

const initialState: ChatbotState = {
  response: null,
  loading: false,
  error: null,
  errorStatus: null,
};

// Async Thunk for Text-Based Chat (Student)
export const fetchChatbotResponse = createAsyncThunk(
  "chatbot/fetchResponse",
  async (
    {
      student_code,
      subject,
      question,
    }: { student_code: any; subject: string; question: string | Blob },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_API}/student_ask_question`,
        { student_code, question, subject },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const chatbotResponse = response.data.message;
      if (chatbotResponse) return chatbotResponse;

      return rejectWithValue({
        message: "No response from chatbot",
        status: 404,
      });
    } catch (error: any) {
      return rejectWithValue({
        message:
          error?.response?.data?.message || "Error fetching chatbot response",
        status: error?.response?.status || 500,
      });
    }
  }
);

// Async Thunk for Text-Based Chat (Teacher)
export const fetchTeacherChatbotResponse = createAsyncThunk(
  "chatbot/fetchTeacherResponse",
  async (
    { teacher_code, question }: { teacher_code: any; question: string | Blob },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_AI_API}/teacher_ask_question`,
        { teacher_code, question },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const chatbotResponse = response.data.message;
      console.log(chatbotResponse);
      
      if (chatbotResponse) return chatbotResponse;

      return rejectWithValue({
        message: "No response from chatbot",
        status: 404,
      });
    } catch (error: any) {
      return rejectWithValue({
        message:
          error?.response?.data?.message || "Error fetching chatbot response",
        status: error?.response?.status || 500,
      });
    }
  }
);

const chatbotSlice = createSlice({
  name: "chatbot",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatbotResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchChatbotResponse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.response = action.payload;
        }
      )
      .addCase(
        fetchChatbotResponse.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload.message;
          state.errorStatus = action.payload.status;
        }
      )
      .addCase(fetchTeacherChatbotResponse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTeacherChatbotResponse.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.loading = false;
          state.response = action.payload;
        }
      )
      .addCase(
        fetchTeacherChatbotResponse.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload.message;
          state.errorStatus = action.payload.status;
        }
      );
  },
});

export default chatbotSlice.reducer;
