/**
 * Tag types for client application
 */

export interface Tag {
  _id: string;
  slug: string;
  label: string;
  createdAt: string;
  updatedAt: string;
}

export interface TagListResponse {
  tags: Tag[];
  nextCursor?: string;
  hasMore: boolean;
}

export interface CreateTagDto {
  label: string;
}

export interface UpdateTagDto {
  label: string;
}

/**
 * Tag state for UI components
 */
export type TagState = 'existing' | 'addable' | 'removable';
