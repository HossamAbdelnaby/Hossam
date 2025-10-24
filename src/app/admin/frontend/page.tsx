'use client'

import { useState } from 'react'
import { 
  Palette, 
  Layout, 
  Type, 
  Image, 
  Eye, 
  Save, 
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Settings,
  Grid,
  List
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'

interface BannerSection {
  id: string
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  backgroundImage: string
  active: boolean
}

interface FeaturedSection {
  id: string
  title: string
  items: Array<{
    id: string
    title: string
    description: string
    image: string
    link: string
  }>
  layout: 'grid' | 'list'
  active: boolean
}

export default function FrontendControl() {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop')
  const [activeTab, setActiveTab] = useState('banners')
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  const [banners, setBanners] = useState<BannerSection[]>([
    {
      id: '1',
      title: 'Welcome to Clash Tournaments',
      subtitle: 'Compete, Win, and Become a Champion',
      buttonText: 'Get Started',
      buttonLink: '/register',
      backgroundImage: '/api/placeholder/1200/400',
      active: true
    },
    {
      id: '2',
      title: 'Special Tournament Event',
      subtitle: 'Join our weekly competitions',
      buttonText: 'Learn More',
      buttonLink: '/tournaments',
      backgroundImage: '/api/placeholder/1200/400',
      active: false
    }
  ])

  const [featuredSections, setFeaturedSections] = useState<FeaturedSection[]>([
    {
      id: '1',
      title: 'Upcoming Tournaments',
      items: [
        {
          id: '1',
          title: 'Spring Championship',
          description: 'The biggest tournament of the season',
          image: '/api/placeholder/300/200',
          link: '/tournaments/spring'
        },
        {
          id: '2',
          title: 'Weekly Clash',
          description: 'Compete every week for prizes',
          image: '/api/placeholder/300/200',
          link: '/tournaments/weekly'
        }
      ],
      layout: 'grid',
      active: true
    }
  ])

  const [layoutSettings, setLayoutSettings] = useState({
    headerStyle: 'fixed',
    sidebarPosition: 'left',
    footerStyle: 'simple',
    colorScheme: 'default',
    borderRadius: 'medium',
    spacing: 'comfortable'
  })

  const [typography, setTypography] = useState({
    headingFont: 'Inter',
    bodyFont: 'Inter',
    baseFontSize: '16',
    lineHeight: '1.6',
    letterSpacing: '0'
  })

  const [customCSS, setCustomCSS] = useState('')

  const getPreviewWidth = () => {
    switch (previewMode) {
      case 'mobile': return 'w-full max-w-sm'
      case 'tablet': return 'w-full max-w-2xl'
      case 'desktop': return 'w-full max-w-6xl'
      default: return 'w-full max-w-6xl'
    }
  }

  const handleBannerUpdate = (id: string, field: keyof BannerSection, value: any) => {
    setBanners(banners.map(banner => 
      banner.id === id ? { ...banner, [field]: value } : banner
    ))
  }

  const handleFeaturedSectionUpdate = (id: string, field: keyof FeaturedSection, value: any) => {
    setFeaturedSections(sections => sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Frontend Control</h1>
          <p className="text-gray-600">Customize your website's appearance and layout</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={isPreviewMode ? "default" : "outline"}
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            <Eye className="mr-2 h-4 w-4" />
            {isPreviewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
          <Button>
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      {/* Preview Mode Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Preview Mode</CardTitle>
          <CardDescription>
            View your changes across different devices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Button
              variant={previewMode === 'desktop' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('desktop')}
            >
              <Monitor className="mr-2 h-4 w-4" />
              Desktop
            </Button>
            <Button
              variant={previewMode === 'tablet' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('tablet')}
            >
              <Tablet className="mr-2 h-4 w-4" />
              Tablet
            </Button>
            <Button
              variant={previewMode === 'mobile' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('mobile')}
            >
              <Smartphone className="mr-2 h-4 w-4" />
              Mobile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls Panel */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="banners">Banners</TabsTrigger>
              <TabsTrigger value="sections">Sections</TabsTrigger>
              <TabsTrigger value="layout">Layout</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
            </TabsList>

            {/* Banners Tab */}
            <TabsContent value="banners" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Hero Banners</CardTitle>
                  <CardDescription>
                    Manage your homepage hero banners
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {banners.map((banner) => (
                    <div key={banner.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">Banner {banner.id}</h3>
                        <Switch
                          checked={banner.active}
                          onCheckedChange={(checked) => handleBannerUpdate(banner.id, 'active', checked)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={banner.title}
                          onChange={(e) => handleBannerUpdate(banner.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Subtitle</Label>
                        <Input
                          value={banner.subtitle}
                          onChange={(e) => handleBannerUpdate(banner.id, 'subtitle', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Button Text</Label>
                          <Input
                            value={banner.buttonText}
                            onChange={(e) => handleBannerUpdate(banner.id, 'buttonText', e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Button Link</Label>
                          <Input
                            value={banner.buttonLink}
                            onChange={(e) => handleBannerUpdate(banner.id, 'buttonLink', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Background Image</Label>
                        <Input
                          value={banner.backgroundImage}
                          onChange={(e) => handleBannerUpdate(banner.id, 'backgroundImage', e.target.value)}
                        />
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Add New Banner
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Sections Tab */}
            <TabsContent value="sections" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Featured Sections</CardTitle>
                  <CardDescription>
                    Configure homepage sections
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {featuredSections.map((section) => (
                    <div key={section.id} className="border rounded-lg p-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{section.title}</h3>
                        <Switch
                          checked={section.active}
                          onCheckedChange={(checked) => handleFeaturedSectionUpdate(section.id, 'active', checked)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Section Title</Label>
                        <Input
                          value={section.title}
                          onChange={(e) => handleFeaturedSectionUpdate(section.id, 'title', e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Layout</Label>
                        <Select
                          value={section.layout}
                          onValueChange={(value) => handleFeaturedSectionUpdate(section.id, 'layout', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="grid">Grid</SelectItem>
                            <SelectItem value="list">List</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Add New Section
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Layout Tab */}
            <TabsContent value="layout" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Layout Settings</CardTitle>
                  <CardDescription>
                    Configure your website layout
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Header Style</Label>
                    <Select
                      value={layoutSettings.headerStyle}
                      onValueChange={(value) => setLayoutSettings({...layoutSettings, headerStyle: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fixed">Fixed</SelectItem>
                        <SelectItem value="static">Static</SelectItem>
                        <SelectItem value="sticky">Sticky</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sidebar Position</Label>
                    <Select
                      value={layoutSettings.sidebarPosition}
                      onValueChange={(value) => setLayoutSettings({...layoutSettings, sidebarPosition: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Footer Style</Label>
                    <Select
                      value={layoutSettings.footerStyle}
                      onValueChange={(value) => setLayoutSettings({...layoutSettings, footerStyle: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="simple">Simple</SelectItem>
                        <SelectItem value="detailed">Detailed</SelectItem>
                        <SelectItem value="minimal">Minimal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Border Radius</Label>
                    <Select
                      value={layoutSettings.borderRadius}
                      onValueChange={(value) => setLayoutSettings({...layoutSettings, borderRadius: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                        <SelectItem value="small">Small</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="large">Large</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Spacing</Label>
                    <Select
                      value={layoutSettings.spacing}
                      onValueChange={(value) => setLayoutSettings({...layoutSettings, spacing: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compact</SelectItem>
                        <SelectItem value="comfortable">Comfortable</SelectItem>
                        <SelectItem value="spacious">Spacious</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Typography Tab */}
            <TabsContent value="typography" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Typography Settings</CardTitle>
                  <CardDescription>
                    Configure fonts and text styles
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <Select
                      value={typography.headingFont}
                      onValueChange={(value) => setTypography({...typography, headingFont: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <Select
                      value={typography.bodyFont}
                      onValueChange={(value) => setTypography({...typography, bodyFont: value})}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Inter">Inter</SelectItem>
                        <SelectItem value="Roboto">Roboto</SelectItem>
                        <SelectItem value="Open Sans">Open Sans</SelectItem>
                        <SelectItem value="Lato">Lato</SelectItem>
                        <SelectItem value="Montserrat">Montserrat</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Base Font Size (px)</Label>
                    <Input
                      value={typography.baseFontSize}
                      onChange={(e) => setTypography({...typography, baseFontSize: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Line Height</Label>
                    <Input
                      value={typography.lineHeight}
                      onChange={(e) => setTypography({...typography, lineHeight: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Letter Spacing</Label>
                    <Input
                      value={typography.letterSpacing}
                      onChange={(e) => setTypography({...typography, letterSpacing: e.target.value})}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Custom CSS */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Custom CSS
              </CardTitle>
              <CardDescription>
                Add custom CSS for advanced styling
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customCSS}
                onChange={(e) => setCustomCSS(e.target.value)}
                rows={8}
                placeholder="Enter custom CSS here..."
                className="font-mono"
              />
            </CardContent>
          </Card>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See your changes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div className={`border rounded-lg overflow-hidden ${getPreviewWidth()}`}>
                  {/* Preview Header */}
                  <div className="bg-primary text-primary-foreground p-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold">Clash Tournaments</h2>
                      <div className="flex space-x-2">
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                        <div className="w-4 h-4 bg-white rounded-full opacity-80"></div>
                      </div>
                    </div>
                  </div>

                  {/* Preview Banner */}
                  <div className="relative h-48 bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-2xl font-bold mb-2">
                        {banners.find(b => b.active)?.title || 'Welcome'}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {banners.find(b => b.active)?.subtitle || 'Subtitle'}
                      </p>
                      <Button size="sm">
                        {banners.find(b => b.active)?.buttonText || 'Get Started'}
                      </Button>
                    </div>
                  </div>

                  {/* Preview Content */}
                  <div className="p-4 space-y-4">
                    {featuredSections.filter(s => s.active).map((section) => (
                      <div key={section.id}>
                        <h3 className="text-lg font-semibold mb-3">{section.title}</h3>
                        <div className={`grid gap-4 ${
                          section.layout === 'grid' ? 'grid-cols-2' : 'grid-cols-1'
                        }`}>
                          {section.items.map((item) => (
                            <div key={item.id} className="border rounded-lg p-3">
                              <div className="w-full h-20 bg-gray-200 rounded mb-2"></div>
                              <h4 className="font-medium text-sm">{item.title}</h4>
                              <p className="text-xs text-gray-600">{item.description}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Preview Footer */}
                  <div className="bg-gray-100 p-4 text-center">
                    <p className="text-sm text-gray-600">© 2024 Clash Tournaments</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}