import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PopularTagsGrid } from '../components/home/PopularTagsGrid';
import { UserTitleGrid } from '../components/home/UserTitleGrid';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className='space-y-8'>
        {/* Popular Tags Section */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Trending Tags</h1>
        </div>
        <section>
          <PopularTagsGrid />
        </section>

        {/* Recent Users Section */}
        <div className='text-center'>
          <h1 className='text-3xl font-bold text-foreground mb-2'>Recently Active Users</h1>
        </div>
        <section>
          <UserTitleGrid />
        </section>
      </div>
    </ProtectedRoute>
  );
}
