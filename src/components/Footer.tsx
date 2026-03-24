import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600">
                <span className="text-sm font-bold text-white">Mo</span>
              </div>
              <span className="text-xl font-bold text-gray-900">MoCampaign</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              A peer-to-peer fundraising platform. Create campaigns, share your story, and make a
              difference.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Platform</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                  Browse Campaigns
                </Link>
              </li>
              <li>
                <Link href="/campaigns/create" className="text-sm text-gray-500 hover:text-gray-700">
                  Start Fundraising
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-sm text-gray-500 hover:text-gray-700">
                  Create Account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Resources</h3>
            <ul className="mt-3 space-y-2">
              <li>
                <span className="text-sm text-gray-500">How It Works</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Fundraising Tips</span>
              </li>
              <li>
                <span className="text-sm text-gray-500">Contact Support</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} MoCampaign. Built for demonstration purposes.
          </p>
        </div>
      </div>
    </footer>
  );
}
