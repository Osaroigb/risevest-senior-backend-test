import dataSource from '../../config/ormconfig';
import { ApiResponse } from '../../config/interface';

export const fetchTopUsersWithLatestComments =
  async (): Promise<ApiResponse> => {
    const query = `
    WITH UserPostCounts AS (
    SELECT 
        users.id AS user_id,
        users.name AS user_name,
        COUNT(posts.id) AS post_count
    FROM 
        users
    LEFT JOIN 
        posts ON users.id = posts."userId"
    GROUP BY 
        users.id, users.name
    LIMIT 3
),
UserLatestComments AS (
    SELECT 
        users.id AS user_id,
        comments.content AS latest_comment,
        ROW_NUMBER() OVER (PARTITION BY users.id ORDER BY comments."createdAt" DESC) AS comment_rank
    FROM 
        users
    LEFT JOIN 
        comments ON users.id = comments."userId"
    WHERE 
        users.id IN (SELECT user_id FROM UserPostCounts)
)
SELECT 
    u.user_id, 
    u.user_name, 
    u.post_count,
    ulc.latest_comment
FROM 
    UserPostCounts u
LEFT JOIN 
    UserLatestComments ulc ON u.user_id = ulc.user_id
WHERE 
    ulc.comment_rank = 1
ORDER BY 
    u.post_count DESC;
    `;

    try {
      const result = await dataSource.query(query);
      return {
        success: true,
        message: 'Top users with latest comments fetched successfully',
        statusCode: 200,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error fetching data',
        statusCode: 500,
        data: error,
      };
    }
  };
