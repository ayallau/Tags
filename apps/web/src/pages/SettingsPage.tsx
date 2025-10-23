export default function SettingsPage() {
  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Settings</h1>
        <p className='text-muted-foreground'>Manage your preferences</p>
      </div>

      <div className='max-w-2xl mx-auto space-y-6'>
        {/* Account Settings */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>Account</h2>
          <div className='space-y-4'>
            <div className='space-y-2'>
              <div className='h-4 w-20 bg-muted animate-pulse rounded-md' />
              <div className='h-10 w-full bg-muted animate-pulse rounded-md' />
            </div>
            <div className='space-y-2'>
              <div className='h-4 w-24 bg-muted animate-pulse rounded-md' />
              <div className='h-10 w-full bg-muted animate-pulse rounded-md' />
            </div>
            <div className='h-8 w-24 bg-muted animate-pulse rounded-md' />
          </div>
        </div>

        {/* Privacy Settings */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>Privacy</h2>
          <div className='space-y-4'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div className='space-y-1'>
                  <div className='h-4 w-32 bg-muted animate-pulse rounded-md' />
                  <div className='h-3 w-48 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='h-6 w-12 bg-muted animate-pulse rounded-full' />
              </div>
            ))}
          </div>
        </div>

        {/* Blocked Users */}
        <div className='bg-surface border border-border rounded-lg p-6'>
          <h2 className='text-lg font-semibold mb-4'>Blocked Users</h2>
          <div className='space-y-3'>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='h-8 w-8 bg-muted animate-pulse rounded-full' />
                  <div className='h-4 w-24 bg-muted animate-pulse rounded-md' />
                </div>
                <div className='h-6 w-16 bg-muted animate-pulse rounded-md' />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
