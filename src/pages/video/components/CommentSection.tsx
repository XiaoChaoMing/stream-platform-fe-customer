import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStore } from '@/store/useStore';
import { formatDistanceToNow } from 'date-fns';
import { useVideoInteraction } from '@/hooks/useVideoInteraction';


interface CommentSectionProps {
  videoId: string | number;
}

export const CommentSection = ({ videoId }: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const { user } = useStore();
  
  // Use the video interaction hook
  const {
    comments,
    isLoadingComments,
    isSubmittingComment,
    submitComment,
    replyToComment,
    loadMoreComments,
    isReplying,
    replyToCommentId,
    commentToEdit,
    editComment,
    deleteComment,
    startEditingComment,
    cancelAction,
    sortOrder,
    changeSortOrder,
  } = useVideoInteraction(Number(videoId));

  // Handle comment submission
  const handleSubmitComment = () => {
    if (!newComment.trim() || !user) return;
    submitComment(newComment);
    setNewComment('');
  };

  // Format date to relative time
  const formatCommentDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };
  console.log(comments);
  return (
    <div className="mt-6 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-start">Comments ({comments.length})</h3>
        
        {/* Sort options */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <select 
            className="text-sm bg-transparent border border-input rounded px-2 py-1"
            value={sortOrder}
            onChange={(e) => changeSortOrder(e.target.value as 'newest' | 'oldest' | 'popular')}
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="popular">Popular</option>
          </select>
        </div>
      </div>
      
      {/* Comment form */}
      {user ? (
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>{user.username?.charAt(0) || 'U'}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <Textarea
              placeholder={isReplying ? `Replying to comment #${replyToCommentId}...` : "Add a comment..."}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full resize-none min-h-[80px]"
            />
            <div className="flex justify-end gap-2">
              {isReplying && (
                <Button 
                  variant="outline" 
                  onClick={cancelAction}
                >
                  Cancel
                </Button>
              )}
              <Button 
                onClick={handleSubmitComment} 
                disabled={!newComment.trim() || isSubmittingComment}
              >
                {isSubmittingComment ? 'Posting...' : isReplying ? 'Post Reply' : 'Post Comment'}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-muted p-4 rounded-md text-center">
          <p>Please sign in to post comments.</p>
        </div>
      )}
      
      {/* Comments list */}
      <div className="space-y-4">
        {isLoadingComments ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent"></div>
          </div>
        ) : comments.length > 0 ? (
          <>
            {comments.map((comment) => (
              <div key={comment.comment_id} className="flex gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage 
                    src={comment.user?.avatar || ''} 
                    alt={comment.user?.username || ''} 
                  />
                  <AvatarFallback>
                    {comment.user?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">
                      {comment.user?.profile?.name || comment.user?.username || 'Unknown User'}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      {formatCommentDate(comment.created_at)}
                    </span>
                  </div>
                  
                  {commentToEdit && commentToEdit.comment_id === comment.comment_id ? (
                    <div className="mb-2">
                      <Textarea
                        defaultValue={commentToEdit.comment_text}
                        className="w-full resize-none min-h-[60px] mb-2"
                      />
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={cancelAction}
                        >
                          Cancel
                        </Button>
                        <Button 
                          size="sm" 
                          onClick={() => {
                            const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                            editComment(comment.comment_id, textarea.value);
                          }}
                        >
                          Save
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm mb-2 text-start">{comment.comment_text}</p>
                  )}
                  
                  <div className="flex items-center gap-3">
                    <button 
                      className="text-xs text-muted-foreground"
                      onClick={() => replyToComment(comment.comment_id)}
                    >
                      Reply
                    </button>
                    
                    {user && comment.user_id === Number(user.user_id) && (
                      <>
                        <button 
                          className="text-xs text-muted-foreground"
                          onClick={() => startEditingComment(comment)}
                        >
                          Edit
                        </button>
                        <button 
                          className="text-xs text-destructive"
                          onClick={() => deleteComment(comment.comment_id)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                  
                  {/* Display replies count */}
                  {comment._count?.replies && comment._count.replies > 0 && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {comment._count.replies} {comment._count.replies === 1 ? 'reply' : 'replies'}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {/* Load more button */}
            <div className="flex justify-center mt-4">
              <Button 
                variant="outline" 
                onClick={loadMoreComments}
                disabled={isLoadingComments}
              >
                {isLoadingComments ? 'Loading...' : 'Load More Comments'}
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No comments yet. Be the first to comment!</p>
          </div>
        )}
      </div>
    </div>
  );
}; 