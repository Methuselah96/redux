import tsd from 'tsd';
import formatter from 'tsd/dist/lib/formatter';

describe('TypeScript definitions', function() {
  it('should compile', async () => {
    const diagnostics = await tsd();
    console.log(formatter(diagnostics));
    expect(diagnostics).toHaveLength(0);
  })
})
