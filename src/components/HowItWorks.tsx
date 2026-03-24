const steps = [
  {
    number: '01',
    title: 'Create your campaign',
    description:
      'Sign up and set up your fundraising page in minutes. Add your story, set a goal, and upload a photo.',
  },
  {
    number: '02',
    title: 'Share with your network',
    description:
      'Spread the word via social media, email, or direct link. The more people you reach, the more you raise.',
  },
  {
    number: '03',
    title: 'Collect donations',
    description:
      'Supporters can donate directly to your campaign. Track progress in real-time from your dashboard.',
  },
  {
    number: '04',
    title: 'Make an impact',
    description:
      'Watch your campaign grow and see the real difference your fundraising makes for men\'s health.',
  },
];

export function HowItWorks() {
  return (
    <section className="bg-gray-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-3 text-lg text-gray-500">
            Start fundraising in four simple steps
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="text-5xl font-bold text-brand-100">{step.number}</div>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
