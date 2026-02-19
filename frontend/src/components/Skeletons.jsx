export default function TournamentCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-cod-darkGray rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-cod-darkGray rounded w-1/2"></div>
        </div>
        <div className="h-8 w-20 bg-cod-darkGray rounded-full"></div>
      </div>
      
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-cod-darkGray rounded w-full"></div>
        <div className="h-4 bg-cod-darkGray rounded w-5/6"></div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="h-12 bg-cod-darkGray rounded"></div>
        <div className="h-12 bg-cod-darkGray rounded"></div>
        <div className="h-12 bg-cod-darkGray rounded"></div>
      </div>

      <div className="h-10 bg-cod-darkGray rounded"></div>
    </div>
  );
}

export function TournamentDetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="card animate-pulse">
        <div className="h-10 bg-cod-darkGray rounded w-1/2 mb-4"></div>
        <div className="h-4 bg-cod-darkGray rounded w-3/4 mb-6"></div>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="h-16 bg-cod-darkGray rounded"></div>
          <div className="h-16 bg-cod-darkGray rounded"></div>
          <div className="h-16 bg-cod-darkGray rounded"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card animate-pulse">
          <div className="h-6 bg-cod-darkGray rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-cod-darkGray rounded"></div>
            ))}
          </div>
        </div>

        <div className="card animate-pulse">
          <div className="h-6 bg-cod-darkGray rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-cod-darkGray rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MatchCardSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 bg-cod-darkGray rounded w-1/2"></div>
        <div className="h-6 w-6 bg-cod-darkGray rounded-full"></div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="h-10 bg-cod-darkGray rounded"></div>
        <div className="h-10 bg-cod-darkGray rounded"></div>
      </div>

      <div className="flex items-center justify-between">
        <div className="h-4 bg-cod-darkGray rounded w-1/3"></div>
        <div className="h-8 w-24 bg-cod-darkGray rounded"></div>
      </div>
    </div>
  );
}

export function ProfileStatsSkeleton() {
  return (
    <div className="card animate-pulse">
      <div className="h-6 bg-cod-darkGray rounded w-1/2 mb-6"></div>
      
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-2">
            <div className="h-4 bg-cod-darkGray rounded w-3/4"></div>
            <div className="h-8 bg-cod-darkGray rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChatMessageSkeleton() {
  return (
    <div className="animate-pulse flex gap-3 mb-4">
      <div className="h-10 w-10 bg-cod-darkGray rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-cod-darkGray rounded w-1/4"></div>
        <div className="h-4 bg-cod-darkGray rounded w-3/4"></div>
      </div>
    </div>
  );
}
