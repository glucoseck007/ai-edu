import axios from "axios";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ChatbotState {
  response: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: ChatbotState = {
  response: null,
  loading: false,
  error: null,
};

export const fetchChatbotResponse = createAsyncThunk(
  "chatbot/fetchResponse",
  async (
    { student_code, question }: { student_code: any; question: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API}/ask-question`,
        { student_code, question },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const chatbotResponse = response.data.message;

      if (chatbotResponse) {
        return chatbotResponse;
      } else {
        return rejectWithValue("No response from chatbot");
      }
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message ||
          "An error occurred while fetching chatbot response"
      );
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
          console.log("Bot Response Received:", action.payload); // Debugging
          state.loading = false;
          state.response = action.payload; // Ensure response updates
        }
      )
      .addCase(fetchChatbotResponse.rejected, (state, action) => {
        console.error("Chatbot API Error:", action.payload); // Debugging
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default chatbotSlice.reducer;
