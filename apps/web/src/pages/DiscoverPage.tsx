export default function DiscoverPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Discover</h1>
        <p className='text-muted-foreground'>Find people who share your interests</p>
      </div>

      <div className='space-y-4'>
        {/* Search/Filter Section */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-xl font-semibold mb-4'>Search & Filter</h2>
          <div className='space-y-3'>
            <div className='h-10 w-full bg-muted animate-pulse rounded-md' />
            <div className='flex gap-2'>
              <div className='h-8 w-20 bg-muted animate-pulse rounded-full' />
              <div className='h-8 w-24 bg-muted animate-pulse rounded-full' />
              <div className='h-8 w-16 bg-muted animate-pulse rounded-full' />
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className='bg-surface border border-border rounded-lg p-4'>
              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='h-10 w-10 bg-muted animate-pulse rounded-full' />
                  <div className='flex-1'>
                    <div className='h-4 w-24 bg-muted animate-pulse rounded-md mb-1' />
                    <div className='h-3 w-16 bg-muted animate-pulse rounded-md' />
                  </div>
                </div>
                <div className='space-y-2'>
                  <div className='h-3 w-full bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-3/4 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='flex gap-1 flex-wrap'>
                  <div className='h-5 w-12 bg-muted animate-pulse rounded-full' />
                  <div className='h-5 w-16 bg-muted animate-pulse rounded-full' />
                  <div className='h-5 w-10 bg-muted animate-pulse rounded-full' />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
