import { baseApiSlice } from "../baseApiSlice";

export const InstructorProfileApiSlice = baseApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ==================== EDUCATION ====================
    getEducations: builder.query({
      query: ({ instructorId }) =>
        `/instructors/${instructorId}/profile/educations`,
      providesTags: (result) =>
        result
          ? [
              { type: "Education", id: "LIST" }, // Đánh dấu danh sách Education
              ...result.map(({ id }) => ({ type: "Education", id })),
            ]
          : [{ type: "Education", id: "LIST" }],
    }),

    getEducationById: builder.query({
      query: ({ instructorId, educationId }) =>
        `/instructors/${instructorId}/profile/educations/${educationId}`,
      providesTags: (result, error, { educationId }) =>
        result ? [{ type: "Education", id: educationId }] : [],
    }),

    manageEducation: builder.mutation({
      query: ({ instructorId, educationId, education, method }) => ({
        url: educationId
          ? `/instructors/${instructorId}/profile/educations/${educationId}`
          : `/instructors/${instructorId}/profile/educations`,
        method,
        body: education,
      }),
      invalidatesTags: [{ type: "Education", id: "LIST" }],
    }),

    deleteEducation: builder.mutation({
      query: ({ instructorId, educationId }) => ({
        url: `/instructors/${instructorId}/profile/educations/${educationId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Education", id: "LIST" }],
    }),

    // ==================== EXPERIENCE ====================
    getExperiences: builder.query({
      query: ({ instructorId }) =>
        `/instructors/${instructorId}/profile/experiences`,
        providesTags: (result) =>
        result
          ? [
              { type: "Experience", id: "LIST" },
              ...result.map(({ id }) => ({ type: "Experience", id })),
            ]
          : [{ type: "Experience", id: "LIST" }],
    }),
    getExperienceById: builder.query({
      query: ({ instructorId, experienceId }) =>
        `/instructors/${instructorId}/profile/experiences/${experienceId}`,
      providesTags: (result, error, { experienceId }) =>
        result ? [{ type: "Experience", id: experienceId }] : [],
    }),

    manageExperience: builder.mutation({
      query: ({ instructorId, experienceId, experience, method }) => ({
        url: experienceId
          ? `/instructors/${instructorId}/profile/experiences/${experienceId}`
          : `/instructors/${instructorId}/profile/experiences`,
        method,
        body: experience,
      }),
      invalidatesTags: [{ type: "Experience" }],
    }),

    deleteExperience: builder.mutation({
      query: ({ instructorId, experienceId }) => ({
        url: `/instructors/${instructorId}/profile/experiences/${experienceId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Experience", id: "LIST" }],
    }),

    // ==================== SKILLS ====================
    getSkills: builder.query({
      query: ({ instructorId }) =>
        `/instructors/${instructorId}/profile/skills`,
        providesTags: (result) =>
        result
          ? [
              { type: "Skill", id: "LIST" },
              ...result.map(({ id }) => ({ type: "Skill", id })),
            ]
          : [{ type: "Skill", id: "LIST" }],
    }),

    getSkillById: builder.query({
      query: ({ instructorId, skillId }) =>
        `/instructors/${instructorId}/profile/skills/${skillId}`,
      providesTags: (result, error, { skillId }) =>
        result ? [{ type: "Skill", id: skillId }] : [],
    }),

    manageSkill: builder.mutation({
      query: ({ instructorId, skillId, skill, method }) => ({
        url: skillId
          ? `/instructors/${instructorId}/profile/skills/${skillId}`
          : `/instructors/${instructorId}/profile/skills`,
        method,
        body: skill,
      }),
      invalidatesTags: [{ type: "Skill" }],
    }),

    deleteSkill: builder.mutation({
      query: ({ instructorId, skillId }) => ({
        url: `/instructors/${instructorId}/profile/skills/${skillId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Skill", id: "LIST" }],
    }),

    // ==================== SOCIAL ====================
    getSocial: builder.query({
      query: ({ instructorId }) =>
        `/instructors/${instructorId}/profile/socials`,
      providesTags: (result, error, { instructorId }) =>
        result ? [{ type: "Social", id: instructorId }] : [],
    }),
    updateSocial: builder.mutation({
      query: ({ instructorId, social }) => ({
        url: `/instructors/${instructorId}/profile/socials`,
        method: "PUT",
        body: social,
      }),
      invalidatesTags: [{ type: "Social" }],
    }),
  }),
  tagTypes: ["Education", "Experience", "Skill", "Social"],
});

export const {
  // EDUCATION
  useGetEducationsQuery,
  useGetEducationByIdQuery,
  useManageEducationMutation,
  useDeleteEducationMutation,

  // EXPERIENCE
  useGetExperiencesQuery,
  useGetExperienceByIdQuery,
  useManageExperienceMutation,
  useDeleteExperienceMutation,

  // SKILLS
  useGetSkillsQuery,
  useGetSkillByIdQuery,
  useManageSkillMutation,
  useDeleteSkillMutation,

  // SOCIAL
  useGetSocialQuery,
  useUpdateSocialMutation,
} = InstructorProfileApiSlice;
