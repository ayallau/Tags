import { ProtectedRoute } from '../components/auth/ProtectedRoute';
import { PopularTagsGrid } from '../components/home/PopularTagsGrid';
import { UserTitleGrid } from '../components/home/UserTitleGrid';

export default function HomePage() {
  return (
    <ProtectedRoute>
      <div className='space-y-8'>
        {/* Popular Tags Section */}
        <section>
          <h2 className='text-2xl font-bold mb-4'>Trending Tags</h2>
          <PopularTagsGrid />
        </section>

        {/* Recent Users Section */}
        <section>
          <h2 className='text-2xl font-bold mb-4'>Recently Active Users</h2>
          <UserTitleGrid />
        </section>
      </div>
    </ProtectedRoute>
  );
}
