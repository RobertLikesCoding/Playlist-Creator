
export const mockSearchApi = (query) => {
  return new Promise((resolve) => {
    const mockArtists = [
      { id: 1, name: 'The Beatles' },
      { id: 2, name: 'Queen' },
      { id: 3, name: 'Michael Jackson' },
      { id: 4, name: 'Elton John' },
      { id: 5, name: 'David Bowie' },
    ];

    resolve({ artists: mockArtists });
  });
};