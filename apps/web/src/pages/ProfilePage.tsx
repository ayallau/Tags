export default function ProfilePage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Profile</h1>
        <p className='text-muted-foreground'>Your profile information</p>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Profile Header */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <div className='flex items-center gap-6'>
            <div className='h-20 w-20 bg-muted animate-pulse rounded-full' />
            <div className='flex-1 space-y-3'>
              <div className='h-6 w-32 bg-muted animate-pulse rounded-md' />
              <div className='h-4 w-48 bg-muted animate-pulse rounded-md' />
              <div className='h-4 w-24 bg-muted animate-pulse rounded-md' />
            </div>
            <div className='h-8 w-20 bg-muted animate-pulse rounded-md' />
          </div>
        </div>

        {/* Bio Section */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>About Me</h2>
          <div className='space-y-2'>
            <div className='h-4 w-full bg-muted animate-pulse rounded-md' />
            <div className='h-4 w-3/4 bg-muted animate-pulse rounded-md' />
            <div className='h-4 w-1/2 bg-muted animate-pulse rounded-md' />
          </div>
        </div>

        {/* Tags Section */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>My Tags</h2>
          <div className='flex gap-2 flex-wrap'>
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className='h-6 w-16 bg-muted animate-pulse rounded-full' />
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>Photos</h2>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='aspect-square bg-muted animate-pulse rounded-lg' />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
