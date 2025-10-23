export default function MatchesPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Matches</h1>
        <p className='text-muted-foreground'>Your compatibility scores</p>
      </div>

      <div className='space-y-4'>
        {/* Sort/Filter Controls */}
        <div className='flex justify-between items-center'>
          <div className='flex gap-2'>
            <div className='h-8 w-24 bg-muted animate-pulse rounded-md' />
            <div className='h-8 w-20 bg-muted animate-pulse rounded-md' />
          </div>
          <div className='h-8 w-32 bg-muted animate-pulse rounded-md' />
        </div>

        {/* Matches List */}
        <div className='space-y-3'>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className='bg-surface border border-border rounded-lg p-4'>
              <div className='flex items-center gap-4'>
                <div className='h-12 w-12 bg-muted animate-pulse rounded-full' />
                <div className='flex-1 space-y-2'>
                  <div className='h-4 w-32 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-24 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='text-right space-y-1'>
                  <div className='h-4 w-12 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-16 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='h-8 w-20 bg-muted animate-pulse rounded-md' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
