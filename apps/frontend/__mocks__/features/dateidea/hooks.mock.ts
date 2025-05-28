export const useFetch = jest.fn();

jest.mock('@/features/dateidea/hooks', () => {
    // import the actual module to preserve the other exports
    const actual = jest.requireActual('@/features/dateidea/hooks');

    return {
        ...actual, // other exports in '@/featuers/dateideas/hooks'
        useFetch: useFetch,
    }
})