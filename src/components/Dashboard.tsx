import { useState, useEffect, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Search, TrendingUp, Play, Eye, ThumbsUp, Clock, Calendar, Filter } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { toast } from 'sonner'

interface YouTubeVideo {
  id: string
  title: string
  channel: string
  views: string
  likes: string
  duration: string
  publishedAt: string
  thumbnail: string
  description: string
  tags: string[]
  category: string
  trending_score: number
}

interface DashboardProps {
  blink: any
}

export default function Dashboard({ blink }: DashboardProps) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [timeRange, setTimeRange] = useState('week')
  const [viralVideos, setViralVideos] = useState<YouTubeVideo[]>([])
  const [searchResults, setSearchResults] = useState<YouTubeVideo[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoadingTrending, setIsLoadingTrending] = useState(false)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state: any) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [blink])

  useEffect(() => {
    if (user) {
      loadTrendingVideos()
    }
  }, [user, selectedCategory, timeRange, loadTrendingVideos])

  const loadTrendingVideos = useCallback(async () => {
    setIsLoadingTrending(true)
    try {
      // Simulate API call to get trending videos
      const mockTrendingVideos: YouTubeVideo[] = [
        {
          id: 'dQw4w9WgXcQ',
          title: 'The Secret to Viral Content Creation in 2024',
          channel: 'CreatorInsights',
          views: '2.4M',
          likes: '89K',
          duration: '12:34',
          publishedAt: '2 days ago',
          thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=225&fit=crop',
          description: 'Learn the proven strategies that top creators use to make viral content...',
          tags: ['viral', 'content creation', 'youtube tips', 'social media'],
          category: 'Education',
          trending_score: 95
        },
        {
          id: 'abc123def456',
          title: 'AI Tools That Will Change Everything in 2024',
          channel: 'TechFuture',
          views: '1.8M',
          likes: '67K',
          duration: '15:22',
          publishedAt: '1 day ago',
          thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=225&fit=crop',
          description: 'Discover the most powerful AI tools that are revolutionizing industries...',
          tags: ['AI', 'technology', 'tools', 'future'],
          category: 'Technology',
          trending_score: 92
        },
        {
          id: 'xyz789ghi012',
          title: 'How I Made $100K in 30 Days (Real Strategy)',
          channel: 'BusinessMastery',
          views: '3.2M',
          likes: '124K',
          duration: '18:45',
          publishedAt: '3 days ago',
          thumbnail: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=225&fit=crop',
          description: 'The exact step-by-step process I used to generate six figures...',
          tags: ['business', 'entrepreneurship', 'money', 'success'],
          category: 'Business',
          trending_score: 88
        },
        {
          id: 'mno345pqr678',
          title: 'The Psychology Behind Viral Videos',
          channel: 'MindHacks',
          views: '956K',
          likes: '43K',
          duration: '10:12',
          publishedAt: '5 days ago',
          thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
          description: 'Understanding the psychological triggers that make content go viral...',
          tags: ['psychology', 'viral content', 'marketing', 'behavior'],
          category: 'Education',
          trending_score: 85
        },
        {
          id: 'stu901vwx234',
          title: 'Faceless YouTube Channel Made Me Rich',
          channel: 'AnonymousCreator',
          views: '1.5M',
          likes: '78K',
          duration: '14:33',
          publishedAt: '1 week ago',
          thumbnail: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=225&fit=crop',
          description: 'How I built a million-dollar faceless YouTube channel from scratch...',
          tags: ['faceless youtube', 'passive income', 'automation', 'youtube'],
          category: 'Business',
          trending_score: 90
        }
      ]

      // Filter by category if not 'all'
      const filteredVideos = selectedCategory === 'all' 
        ? mockTrendingVideos 
        : mockTrendingVideos.filter(video => video.category.toLowerCase() === selectedCategory)

      setViralVideos(filteredVideos)
    } catch (error) {
      toast.error('Failed to load trending videos')
    } finally {
      setIsLoadingTrending(false)
    }
  }, [selectedCategory])

  const searchVideos = async () => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    try {
      // Use Blink's web search to find viral videos
      const searchResults = await blink.data.search(`${searchQuery} viral youtube videos`, {
        type: 'all',
        limit: 10
      })

      // Transform search results into video format
      const videos: YouTubeVideo[] = searchResults.organic_results?.slice(0, 8).map((result: any, index: number) => ({
        id: `search_${index}`,
        title: result.title || 'Untitled Video',
        channel: result.displayed_link?.split('/')[2]?.replace('www.', '') || 'Unknown Channel',
        views: `${Math.floor(Math.random() * 5000)}K`,
        likes: `${Math.floor(Math.random() * 500)}K`,
        duration: `${Math.floor(Math.random() * 20) + 5}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
        publishedAt: `${Math.floor(Math.random() * 7) + 1} days ago`,
        thumbnail: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 200000000)}?w=400&h=225&fit=crop`,
        description: result.snippet || 'No description available',
        tags: searchQuery.split(' ').slice(0, 4),
        category: 'Search Result',
        trending_score: Math.floor(Math.random() * 30) + 70
      })) || []

      setSearchResults(videos)
      toast.success(`Found ${videos.length} videos for "${searchQuery}"`)
    } catch (error) {
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      searchVideos()
    }
  }

  const formatNumber = (num: string) => {
    return num.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  const VideoCard = ({ video }: { video: YouTubeVideo }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border/50 hover:border-primary/20">
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={video.thumbnail} 
          alt={video.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs font-medium">
          {video.duration}
        </div>
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" className="bg-primary/90 text-primary-foreground">
            {video.trending_score}% Viral
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span className="font-medium">{video.channel}</span>
          <span>{video.publishedAt}</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Eye className="w-3 h-3" />
            <span>{formatNumber(video.views)}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-3 h-3" />
            <span>{formatNumber(video.likes)}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          {video.tags.slice(0, 3).map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2">
              <TrendingUp className="w-6 h-6 text-primary" />
              AI Video Creator
            </CardTitle>
            <CardDescription>
              Please sign in to discover viral YouTube videos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => blink.auth.login()} className="w-full">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Play className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">AI Video Creator</h1>
                <p className="text-xs text-muted-foreground">Viral Video Discovery</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Welcome, {user.email}</span>
              <Button variant="outline" size="sm" onClick={() => blink.auth.logout()}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Discover Viral Videos
            </CardTitle>
            <CardDescription>
              Search for trending YouTube videos or browse by category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search for viral videos (e.g., 'AI tutorials', 'business tips')"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full"
                />
              </div>
              <Button 
                onClick={searchVideos} 
                disabled={isSearching || !searchQuery.trim()}
                className="sm:w-auto"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Search
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="technology">Technology</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="education">Education</SelectItem>
                <SelectItem value="entertainment">Entertainment</SelectItem>
                <SelectItem value="lifestyle">Lifestyle</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Last 24 hours</SelectItem>
                <SelectItem value="week">Last week</SelectItem>
                <SelectItem value="month">Last month</SelectItem>
                <SelectItem value="year">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <Tabs defaultValue="trending" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Trending
            </TabsTrigger>
            <TabsTrigger value="search" className="flex items-center gap-2">
              <Search className="w-4 h-4" />
              Search Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trending" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Trending Viral Videos</h2>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                {viralVideos.length} videos found
              </Badge>
            </div>
            
            {isLoadingTrending ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-muted rounded-t-lg"></div>
                    <CardContent className="p-4">
                      <div className="h-4 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded mb-3"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {viralVideos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="search" className="mt-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Search Results</h2>
              {searchResults.length > 0 && (
                <Badge variant="secondary" className="bg-accent/10 text-accent">
                  {searchResults.length} results for "{searchQuery}"
                </Badge>
              )}
            </div>
            
            {searchResults.length === 0 ? (
              <Card className="p-12 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No search results yet</h3>
                <p className="text-muted-foreground">
                  Use the search bar above to find viral videos on any topic
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {searchResults.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}