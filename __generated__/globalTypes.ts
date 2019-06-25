/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

export enum BlogPostOrderByInput {
  content_ASC = "content_ASC",
  content_DESC = "content_DESC",
  createdAt_ASC = "createdAt_ASC",
  createdAt_DESC = "createdAt_DESC",
  id_ASC = "id_ASC",
  id_DESC = "id_DESC",
  slug_ASC = "slug_ASC",
  slug_DESC = "slug_DESC",
  status_ASC = "status_ASC",
  status_DESC = "status_DESC",
  title_ASC = "title_ASC",
  title_DESC = "title_DESC",
  updatedAt_ASC = "updatedAt_ASC",
  updatedAt_DESC = "updatedAt_DESC",
}

export enum Status {
  ARCHIVED = "ARCHIVED",
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export interface BlogPostWhereInput {
  AND?: BlogPostWhereInput[] | null;
  OR?: BlogPostWhereInput[] | null;
  NOT?: BlogPostWhereInput[] | null;
  status?: Status | null;
  status_not?: Status | null;
  status_in?: Status[] | null;
  status_not_in?: Status[] | null;
  updatedAt?: any | null;
  updatedAt_not?: any | null;
  updatedAt_in?: any[] | null;
  updatedAt_not_in?: any[] | null;
  updatedAt_lt?: any | null;
  updatedAt_lte?: any | null;
  updatedAt_gt?: any | null;
  updatedAt_gte?: any | null;
  createdAt?: any | null;
  createdAt_not?: any | null;
  createdAt_in?: any[] | null;
  createdAt_not_in?: any[] | null;
  createdAt_lt?: any | null;
  createdAt_lte?: any | null;
  createdAt_gt?: any | null;
  createdAt_gte?: any | null;
  id?: string | null;
  id_not?: string | null;
  id_in?: string[] | null;
  id_not_in?: string[] | null;
  id_lt?: string | null;
  id_lte?: string | null;
  id_gt?: string | null;
  id_gte?: string | null;
  id_contains?: string | null;
  id_not_contains?: string | null;
  id_starts_with?: string | null;
  id_not_starts_with?: string | null;
  id_ends_with?: string | null;
  id_not_ends_with?: string | null;
  title?: string | null;
  title_not?: string | null;
  title_in?: string[] | null;
  title_not_in?: string[] | null;
  title_lt?: string | null;
  title_lte?: string | null;
  title_gt?: string | null;
  title_gte?: string | null;
  title_contains?: string | null;
  title_not_contains?: string | null;
  title_starts_with?: string | null;
  title_not_starts_with?: string | null;
  title_ends_with?: string | null;
  title_not_ends_with?: string | null;
  content?: string | null;
  content_not?: string | null;
  content_in?: string[] | null;
  content_not_in?: string[] | null;
  content_lt?: string | null;
  content_lte?: string | null;
  content_gt?: string | null;
  content_gte?: string | null;
  content_contains?: string | null;
  content_not_contains?: string | null;
  content_starts_with?: string | null;
  content_not_starts_with?: string | null;
  content_ends_with?: string | null;
  content_not_ends_with?: string | null;
  slug?: string | null;
  slug_not?: string | null;
  slug_in?: string[] | null;
  slug_not_in?: string[] | null;
  slug_lt?: string | null;
  slug_lte?: string | null;
  slug_gt?: string | null;
  slug_gte?: string | null;
  slug_contains?: string | null;
  slug_not_contains?: string | null;
  slug_starts_with?: string | null;
  slug_not_starts_with?: string | null;
  slug_ends_with?: string | null;
  slug_not_ends_with?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
