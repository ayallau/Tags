import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PopularTagsGrid } from '../components/home/PopularTagsGrid';
import { UserTitleGrid } from '../components/home/UserTitleGrid';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className='container mx-auto px-4 space-y-16'>
        {/* Popular Tags Section */}
        <section className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Trending Tags</h1>
            <p className='text-muted-foreground text-sm'>Discover the most popular tags</p>
          </div>
          <PopularTagsGrid />
        </section>

        {/* Recent Users Section */}
        <section className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-3xl font-bold text-foreground mb-2'>Recently Active Users</h1>
            <p className='text-muted-foreground text-sm'>Connect with users who share your interests</p>
          </div>
          <UserTitleGrid />
        </section>
      </div>
    </ProtectedRoute>
  );
}
