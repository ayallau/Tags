export default function FriendsPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Friends</h1>
        <p className='text-muted-foreground'>Your connections</p>
      </div>

      <div className='space-y-4'>
        {/* Search Bar */}
        <div className='h-10 w-full bg-muted animate-pulse rounded-md' />

        {/* Friends List */}
        <div className='space-y-3'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='bg-surface border border-border rounded-lg p-4'>
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 bg-muted animate-pulse rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-28 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-20 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='flex gap-2'>
                  <div className='h-8 w-16 bg-muted animate-pulse rounded-md' />
                  <div className='h-8 w-8 bg-muted animate-pulse rounded-md' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
