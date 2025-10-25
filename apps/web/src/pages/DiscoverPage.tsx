import { useState } from 'react';
import { DataState } from '../components/data';
import { Button } from '../components/ui/button';

type DataStatus = 'idle' | 'loading' | 'empty' | 'error' | 'success';

export default function DiscoverPage() {
  const [dataStatus, setDataStatus] = useState<DataStatus>('success');

  const handleStatusChange = (status: DataStatus) => {
    setDataStatus(status);
  };

  const simulateError = () => {
    setDataStatus('error');
  };

  const simulateLoading = () => {
    setDataStatus('loading');
    setTimeout(() => setDataStatus('success'), 2000);
  };

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-foreground mb-4'>Discover</h1>
        <p className='text-muted-foreground'>Find people who share your interests</p>
      </div>

      {/* Demo Controls */}
      <div className='bg-surface border border-border rounded-lg p-6'>
        <h2 className='text-xl font-semibold mb-4'>DataState Demo Controls</h2>
        <div className='flex flex-wrap gap-2 mb-4'>
          <Button 
            variant={dataStatus === 'loading' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('loading')}
          >
            Loading
          </Button>
          <Button 
            variant={dataStatus === 'empty' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('empty')}
          >
            Empty
          </Button>
          <Button 
            variant={dataStatus === 'error' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('error')}
          >
            Error
          </Button>
          <Button 
            variant={dataStatus === 'success' ? 'default' : 'outline'}
            onClick={() => handleStatusChange('success')}
          >
            Success
          </Button>
        </div>
        <div className='flex gap-2'>
          <Button variant="secondary" onClick={simulateLoading}>
            Simulate Loading (2s)
          </Button>
          <Button variant="destructive" onClick={simulateError}>
            Simulate Error
          </Button>
        </div>
      </div>

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

      {/* DataState Demo */}
      <DataState status={dataStatus}>
        {/* Success State Content */}
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
      </DataState>
    </div>
  );
}
